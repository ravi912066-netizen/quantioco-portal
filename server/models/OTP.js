const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    identifier: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: { expires: '5m' } } // OTP expires in 5 minutes
});

module.exports = mongoose.model('OTP', otpSchema);
