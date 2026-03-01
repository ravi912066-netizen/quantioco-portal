const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: String, default: 'General' },
    question: { type: String, required: true },
    answer: { type: String, default: '' },
    resolved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Doubt', doubtSchema);
