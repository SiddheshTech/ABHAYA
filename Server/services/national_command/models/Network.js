const mongoose = require('mongoose');

const networkSchema = new mongoose.Schema({
    clusterId: { type: String, required: true },
    growthStatus: { type: String, default: 'Stable' },
    kingpinsDetected: { type: Number, default: 0 },
    affectedStates: [{ type: String }],
    threatLevel: { type: String, default: 'Medium' }
}, { timestamps: true });

module.exports = mongoose.model('Network', networkSchema);
