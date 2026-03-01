const express = require('express');
const router = express.Router();
const LiveClass = require('../models/LiveClass');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/live-classes (Admin creates class)
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const { title, meetLink } = req.body;
        const roomName = `quantioco-live-${Math.random().toString(36).substring(7)}`;

        const liveClass = await LiveClass.create({
            title,
            roomName,
            meetLink: meetLink || '',
            instructor: req.user._id,
        });

        res.status(201).json(liveClass);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/live-classes (List active classes)
router.get('/', protect, async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { status: 'active' };
        const classes = await LiveClass.find(query)
            .populate('instructor', 'name avatar')
            .populate('attendees.user', 'name email avatar')
            .sort({ createdAt: -1 });
        res.json(classes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/live-classes/:id/join (Student joins/attendance)
router.post('/:id/join', protect, async (req, res) => {
    try {
        const liveClass = await LiveClass.findById(req.params.id);
        if (!liveClass || liveClass.status !== 'active') {
            return res.status(404).json({ message: 'Class not found or inactive' });
        }

        // Add to attendees if not already present
        const alreadyJoined = liveClass.attendees.some(a => a.user.toString() === req.user._id.toString());
        if (!alreadyJoined) {
            liveClass.attendees.push({ user: req.user._id });
            await liveClass.save();
        }

        res.json({ message: 'Joined successfully', liveClass });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/live-classes/:id/end (Admin ends class)
router.put('/:id/end', protect, adminOnly, async (req, res) => {
    try {
        const liveClass = await LiveClass.findByIdAndUpdate(
            req.params.id,
            { status: 'ended' },
            { new: true }
        );
        res.json(liveClass);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/live-classes/:id/materials (Admin pushes material)
router.post('/:id/materials', protect, adminOnly, async (req, res) => {
    try {
        const { title, link, type } = req.body;
        const liveClass = await LiveClass.findById(req.params.id);

        if (!liveClass || liveClass.status !== 'active') {
            return res.status(404).json({ message: 'Class not found or inactive' });
        }

        liveClass.materials.push({ title, link, type });
        await liveClass.save();

        res.json(liveClass);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/live-classes/:id/materials/:materialId (Admin removes material)
router.delete('/:id/materials/:materialId', protect, adminOnly, async (req, res) => {
    try {
        const liveClass = await LiveClass.findById(req.params.id);
        if (!liveClass) return res.status(404).json({ message: 'Class not found' });

        liveClass.materials = liveClass.materials.filter(m => m._id.toString() !== req.params.materialId);
        await liveClass.save();

        res.json(liveClass);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
