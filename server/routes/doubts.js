const express = require('express');
const router = express.Router();
const Doubt = require('../models/Doubt');
const { protect, adminOnly } = require('../middleware/auth');

// GET all doubts (admin)
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const doubts = await Doubt.find()
            .populate('student', 'name email')
            .sort('-createdAt');
        res.json(doubts);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST ask a doubt (student)
router.post('/', protect, async (req, res) => {
    try {
        const doubt = await Doubt.create({ ...req.body, student: req.user._id });
        res.status(201).json(doubt);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT answer/resolve doubt (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const doubt = await Doubt.findByIdAndUpdate(req.params.id,
            { answer: req.body.answer, resolved: true }, { new: true });
        res.json(doubt);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
