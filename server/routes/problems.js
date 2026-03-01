const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET my problems
router.get('/', protect, async (req, res) => {
    try {
        const problems = await Problem.find({ student: req.user._id }).sort('-createdAt');
        res.json(problems);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST add problem
router.post('/', protect, async (req, res) => {
    try {
        const problem = await Problem.create({ ...req.body, student: req.user._id });
        res.status(201).json(problem);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT update problem
router.put('/:id', protect, async (req, res) => {
    try {
        const problem = await Problem.findOneAndUpdate(
            { _id: req.params.id, student: req.user._id },
            req.body, { new: true }
        );
        // If marked solved, update count
        if (req.body.status === 'Solved') {
            await User.findByIdAndUpdate(req.user._id, { $inc: { problemsSolved: 1, xp: 5 } });
        }
        res.json(problem);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE problem
router.delete('/:id', protect, async (req, res) => {
    try {
        await Problem.findOneAndDelete({ _id: req.params.id, student: req.user._id });
        res.json({ message: 'Problem deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
