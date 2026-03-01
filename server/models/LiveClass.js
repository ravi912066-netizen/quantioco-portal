const mongoose = require('mongoose');

const liveClassSchema = new mongoose.Schema({
    title: { type: String, required: true },
    roomName: { type: String, required: true, unique: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['active', 'ended'], default: 'active' },
    attendees: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        joinedAt: { type: Date, default: Date.now }
    }],
    materials: [{
        title: String,
        link: String,
        type: { type: String, enum: ['note', 'link', 'doc'], default: 'note' },
        addedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('LiveClass', liveClassSchema);
