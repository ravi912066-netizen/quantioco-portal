const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problemName: { type: String, required: true },
    platform: { type: String, default: 'LeetCode' },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    solution: { type: String, default: '' },
    notes: { type: String, default: '' },
    status: { type: String, enum: ['Solved', 'Attempted', 'Todo'], default: 'Todo' },
    bookmarked: { type: Boolean, default: false },
    concept: { type: String, default: '' },
    problemUrl: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);
