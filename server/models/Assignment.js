const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    course: { type: String, required: true },
    lectureId: { type: String, default: null },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    problemUrl: { type: String, default: '' },
    docUrl: { type: String, default: '' },
    materials: [{
        type: { type: String, enum: ['document', 'url', 'sheet'], default: 'url' },
        url: { type: String, required: true },
        name: { type: String, required: true }
    }],
    deadline: { type: Date },
    attempting: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    xpReward: { type: Number, default: 10 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
