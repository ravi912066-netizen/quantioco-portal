const express = require('express');
const router = express.Router();
const EnrollmentRequest = require('../models/EnrollmentRequest');
const Course = require('../models/Course');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const notifier = require('node-notifier');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'test@gmail.com',
        pass: process.env.EMAIL_PASS || 'test'
    }
});

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
            amount: amount,
            status: 'Approved' // Auto-approve for instant access
        });

        const courseObj = await Course.findById(courseId);

        // Auto-enroll the user
        if (!courseObj.enrolledStudents.includes(req.user._id)) {
            courseObj.enrolledStudents.push(req.user._id);
            await courseObj.save();
            await User.findByIdAndUpdate(req.user._id, { $addToSet: { enrolledCourses: courseObj._id } });
        }


        // --- Notifications ---
        const notificationMessage = `Payment request of ₹${amount} received from ${req.user.name} for course ${courseObj?.name || 'Unknown'}. Please verify in portal.`;

        // 2. Email Notification
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER || 'alerts@quantioco.io',
                to: process.env.ADMIN_EMAIL || 'ravi912066@gmail.com',
                subject: '🔥 Quantioco: New UPI Payment Received!',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #6366f1;">New Enrollment Request!</h2>
                        <p>A new student has paid via UPI and requested access.</p>
                        <ul>
                            <li><strong>Student Name:</strong> ${req.user.name}</li>
                            <li><strong>Email:</strong> ${req.user.email}</li>
                            <li><strong>Course:</strong> ${courseObj?.name || 'Unknown'}</li>
                            <li><strong>Amount Paid:</strong> ₹${amount}</li>
                        </ul>
                        <p>Course access has been granted automatically.</p>
                        <a href="https://quantioco.io/admin" style="background-color: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View in Portal</a>
                    </div>
                `
            });
        } catch (mailErr) {
            console.error('Failed to send email:', mailErr.message);
        }

        res.status(201).json({ message: 'Enrollment successful. Instantly activated.', request });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Admin Manual Enrollment
router.post('/enrollments/manual', protect, adminOnly, async (req, res) => {
    try {
        const { userId, courseId } = req.body;

        const user = await User.findById(userId);
        const course = await Course.findById(courseId);

        if (!user || !course) {
            return res.status(404).json({ message: 'User or Course not found' });
        }

        if (user.enrolledCourses.includes(courseId)) {
            return res.status(400).json({ message: 'Student is already enrolled in this course.' });
        }

        // Enroll User
        if (!course.enrolledStudents.includes(userId)) {
            course.enrolledStudents.push(userId);
            await course.save();
        }
        await User.findByIdAndUpdate(userId, { $addToSet: { enrolledCourses: courseId } });

        res.json({ message: 'Student successfully granted access to course' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
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
