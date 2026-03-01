const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// GET all assignments
router.get('/', protect, async (req, res) => {
    try {
        const assignments = await Assignment.find().sort('-createdAt');
        res.json(assignments);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create assignment (admin)
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const assignment = await Assignment.create({ ...req.body, createdBy: req.user._id });
        res.status(201).json(assignment);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT update assignment (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(assignment);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE assignment (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        await Assignment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Assignment deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT record attempt (student)
router.put('/:id/attempt', protect, async (req, res) => {
    try {
        await Assignment.findByIdAndUpdate(req.params.id, { $addToSet: { attempting: req.user._id } });
        res.json({ message: 'Attempt recorded' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST submit assignment (student)
router.post('/:id/submit', protect, async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        const existing = await Submission.findOne({ student: req.user._id, assignment: req.params.id });
        if (existing) return res.status(400).json({ message: 'Already submitted' });

        const submission = await Submission.create({
            student: req.user._id,
            assignment: req.params.id,
            code: req.body.code,
            solutionLink: req.body.solutionLink,
            xpAwarded: assignment.xpReward
        });

        // Award XP
        await User.findByIdAndUpdate(req.user._id, { $inc: { xp: assignment.xpReward } });

        res.status(201).json(submission);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET all submissions (admin)
router.get('/submissions/all', protect, adminOnly, async (req, res) => {
    try {
        const submissions = await Submission.find()
            .populate('student', 'name email')
            .populate('assignment', 'title course')
            .sort('-submittedAt');
        res.json(submissions);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET my submissions (student)
router.get('/submissions/me', protect, async (req, res) => {
    try {
        const submissions = await Submission.find({ student: req.user._id })
            .populate('assignment', 'title xpReward')
            .sort('-submittedAt');
        res.json(submissions);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
