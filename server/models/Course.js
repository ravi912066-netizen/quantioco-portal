const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
    title: { type: String, required: true },
    videoUrl: { type: String, default: '' },
    pdfUrl: { type: String, default: '' },
    duration: { type: String, default: '' },
    order: { type: Number, default: 0 },
});

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, default: 0 },
    instructor: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    category: { type: String, default: 'General' },
    lectures: [lectureSchema],
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isPublished: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
