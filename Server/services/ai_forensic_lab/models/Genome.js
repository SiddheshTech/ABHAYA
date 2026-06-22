const mongoose = require('mongoose');

const genomeSchema = new mongoose.Schema({
    networkId: { type: String, required: true, unique: true },
    mutationProbability: Number,
    expectedShift: String,
    predictedExpansion: String,
    kingpinDetected: { type: Boolean, default: false },
    networkStrength: Number,
    collapsePoint: String,
    nodes: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Genome', genomeSchema);
