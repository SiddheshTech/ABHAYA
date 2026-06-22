const mongoose = require('mongoose');

const reconstructionSchema = new mongoose.Schema({
  caseId: { type: String }, // Links to a potential FIR/Case, if applicable
  inputs: {
    photoUrl: { type: String },
    voiceSampleUrl: { type: String },
    ageEstimate: { type: Number },
    heightCm: { type: Number },
    weightKg: { type: Number },
    physicalFeatures: [{ type: String }],
    languageSampleUrl: { type: String }
  },
  aiResults: {
    predictedOriginState: { type: String },
    predictedOriginDistrict: { type: String },
    villageCluster: [{ type: String }],
    potentialFamiliesCount: { type: Number },
    confidence: { type: Number, min: 0, max: 100 }
  },
  explainability: {
    dialectReasoning: { type: String },
    nutritionReasoning: { type: String },
    voicePatternReasoning: { type: String }
  },
  blockchainHash: { type: String } // Immutable ledger record
}, { timestamps: true });

// Text index for Intelligence Archive universal search
reconstructionSchema.index({ '$**': 'text' });

module.exports = mongoose.model('Reconstruction', reconstructionSchema);
