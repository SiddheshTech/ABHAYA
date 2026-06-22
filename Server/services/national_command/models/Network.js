const mongoose = require('mongoose');

const networkSchema = new mongoose.Schema({
    clusterId: { type: String, required: true, unique: true }, // e.g. "Cluster G12"
    growthStatus: { type: String, enum: ['Stable', 'Expanding', 'Mutating', 'Dismantled'], default: 'Expanding' },
    kingpinsDetected: { type: Number, default: 0 },
    affectedStates: [{ type: String }],
    threatLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'High' }
}, { timestamps: true });

module.exports = mongoose.model('Network', networkSchema);
