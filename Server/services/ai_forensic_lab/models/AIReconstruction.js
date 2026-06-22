const mongoose = require('mongoose');

const aiReconstructionSchema = new mongoose.Schema({
    caseId: { type: String, required: true },
    photoUrl: String,
    voiceSampleUrl: String,
    predictedOrigin: {
        state: String,
        district: String,
        confidence: Number
    },
    villageCluster: [String],
    potentialFamilies: { type: Number, default: 0 },
    reasoning: [String]
}, { timestamps: true });

module.exports = mongoose.model('AIReconstruction', aiReconstructionSchema);
