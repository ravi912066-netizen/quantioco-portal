const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// GET leaderboard (top 50 by XP)
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find({ role: 'student' })
            .select('name avatar xp problemsSolved streak')
            .sort({ xp: -1 })
            .limit(50);
        res.json(users);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET all students (admin)
router.get('/students', protect, adminOnly, async (req, res) => {
    try {
        const students = await User.find({ role: 'student' })
            .select('-password')
            .sort('-createdAt');
        res.json(students);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET my profile
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT update profile
router.put('/me', protect, async (req, res) => {
    try {
        const { name, institution, cfHandle, discordHandle, avatar, phone } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, institution, cfHandle, discordHandle, avatar, phone },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST log activity (for heatmap)
router.post('/activity', protect, async (req, res) => {
    try {
        const { date, increment } = req.body;
        const user = await User.findById(req.user._id);
        const entry = user.activityLog.find(a => a.date === date);
        if (entry) entry.count += increment || 1;
        else user.activityLog.push({ date, count: increment || 1 });
        await user.save();
        res.json({ message: 'Activity logged' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET admin stats
router.get('/admin/stats', protect, adminOnly, async (req, res) => {
    try {
        const Course = require('../models/Course');
        const Assignment = require('../models/Assignment');
        const studentCount = await User.countDocuments({ role: 'student' });
        const courseCount = await Course.countDocuments();
        const assignmentCount = await Assignment.countDocuments();
        const xpTotal = await User.aggregate([{ $group: { _id: null, total: { $sum: '$xp' } } }]);
        res.json({
            students: studentCount,
            courses: courseCount,
            assignments: assignmentCount,
            platformXP: xpTotal[0]?.total || 0
        });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT approve student (admin)
router.put('/:id/approve', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true }).select('-password');
        res.json(user);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
