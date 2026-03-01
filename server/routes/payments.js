const express = require('express');
const router = express.Router();
const EnrollmentRequest = require('../models/EnrollmentRequest');
const Course = require('../models/Course');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// POST create enrollment request (from student clicking UPI I Have Paid)
router.post('/enroll', protect, async (req, res) => {
    try {
        const { courseId, amount } = req.body;

        // Ensure not already enrolled
        const user = await User.findById(req.user._id);
        if (user.enrolledCourses.includes(courseId)) {
            return res.status(400).json({ message: 'Already enrolled in this course.' });
        }

        // Check if request already exists
        const existing = await EnrollmentRequest.findOne({ user: req.user._id, course: courseId, status: 'Pending' });
        if (existing) {
            return res.status(400).json({ message: 'Enrollment request already pending for this course.' });
        }

        const request = await EnrollmentRequest.create({
            user: req.user._id,
            course: courseId,
            amount: amount
        });

        res.status(201).json({ message: 'Enrollment request submitted.', request });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET pending enrollments (Admin)
router.get('/enrollments/pending', protect, adminOnly, async (req, res) => {
    try {
        const requests = await EnrollmentRequest.find({ status: 'Pending' })
            .populate('user', 'name email')
            .populate('course', 'name price')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST approve/reject enrollment (Admin)
router.post('/enrollments/:id/:action', protect, adminOnly, async (req, res) => {
    try {
        const { id, action } = req.params;
        const request = await EnrollmentRequest.findById(id);

        if (!request) return res.status(404).json({ message: 'Request not found' });

        if (action === 'approve') {
            request.status = 'Approved';
            // Add student to course
            await Course.findByIdAndUpdate(request.course, { $addToSet: { enrolledStudents: request.user } });
            // Add course to student
            await User.findByIdAndUpdate(request.user, { $addToSet: { enrolledCourses: request.course } });
        } else if (action === 'reject') {
            request.status = 'Rejected';
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        await request.save();
        res.json({ message: `Request successfully ${action}d.` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
