const mongoose = require('mongoose');

const aiModelSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g. "Identity Engine", "Network Genome"
    healthStatus: { type: String, enum: ['Healthy', 'Degraded', 'Critical'], default: 'Healthy' },
    accuracy: { type: Number, required: true }, // e.g. 91%
    predictionsGenerated: { type: Number, default: 0 },
    retrainingStatus: { type: String, enum: ['Up to date', 'Training', 'Required'], default: 'Up to date' },
    inferenceSpeedMs: { type: Number },
    systemLoadPercent: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('AIModel', aiModelSchema);
