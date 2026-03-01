const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// GET all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true });
        res.json(courses);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single course
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create course (admin)
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json(course);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT update course (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(course);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE course (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: 'Course deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST add lecture to course (admin)
router.post('/:id/lectures', protect, adminOnly, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        course.lectures.push(req.body);
        await course.save();
        res.status(201).json(course);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT update lecture (admin)
router.put('/:id/lectures/:lectureId', protect, adminOnly, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        const lecture = course.lectures.id(req.params.lectureId);
        if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

        Object.assign(lecture, req.body);
        await course.save();
        res.json(course);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE lecture (admin)
router.delete('/:id/lectures/:lectureId', protect, adminOnly, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        course.lectures = course.lectures.filter(l => l._id.toString() !== req.params.lectureId);
        await course.save();
        res.json(course);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST enroll student
router.post('/:id/enroll', protect, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        if (!course.enrolledStudents.includes(req.user._id)) {
            course.enrolledStudents.push(req.user._id);
            await course.save();
            await User.findByIdAndUpdate(req.user._id, { $addToSet: { enrolledCourses: course._id } });
        }
        res.json({ message: 'Enrolled successfully' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
