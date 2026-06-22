const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
    emergencyId: { type: String, required: true, unique: true },
    type: { type: String, enum: ['Amber Alert', 'Red Alert', 'Disaster Event'], required: true },
    description: String,
    escalationLevel: { type: String, enum: ['Level 1', 'Level 2', 'Level 3', 'Critical'] },
    authorityNotified: { type: Boolean, default: true },
    estimatedImpact: String,
    status: { type: String, enum: ['Active', 'Resolved'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Emergency', emergencySchema);
