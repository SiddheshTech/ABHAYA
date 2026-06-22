const mongoose = require('mongoose');

const criminalProfileSchema = new mongoose.Schema({
  suspectId: { type: String, required: true, unique: true },
  archetype: {
    type: String,
    enum: ['Manipulator', 'Recruiter', 'Transporter', 'Financier', 'Unknown'],
    default: 'Unknown'
  },
  behaviorHistory: [{ type: String }],
  associatedCrimes: [{ type: String }],
  knownPatterns: [{ type: String }],
  metrics: {
    similarityScoreToPastCases: { type: Number, min: 0, max: 100 },
    riskLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] },
    violencePotential: { type: Number, min: 0, max: 100 },
    reoffendingProbability: { type: Number, min: 0, max: 100 }
  },
  aiExplanation: {
    matchedPattern: { type: String },
    likelyBehavior: [{ type: String }]
  }
}, { timestamps: true });

// Text index for Intelligence Archive
criminalProfileSchema.index({ '$**': 'text' });

module.exports = mongoose.model('CriminalProfile', criminalProfileSchema);
