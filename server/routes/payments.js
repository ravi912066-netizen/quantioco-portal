const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Course = require('../models/Course');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST create order
router.post('/create-order', protect, async (req, res) => {
    try {
        const { courseId } = req.body;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const options = {
            amount: course.price * 100, // paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);
        res.json({ order, course: { name: course.name, price: course.price } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST verify payment
router.post('/verify', protect, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSig = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest('hex');

        if (expectedSig !== razorpay_signature)
            return res.status(400).json({ message: 'Payment verification failed' });

        // Enroll student
        await Course.findByIdAndUpdate(courseId, { $addToSet: { enrolledStudents: req.user._id } });
        await User.findByIdAndUpdate(req.user._id, { $addToSet: { enrolledCourses: courseId } });

        res.json({ message: 'Payment verified and course unlocked!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
