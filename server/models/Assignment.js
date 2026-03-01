const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    course: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    problemUrl: { type: String, default: '' },
    docUrl: { type: String, default: '' },
    deadline: { type: Date },
    xpReward: { type: Number, default: 10 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
