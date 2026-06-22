const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    suspectId: { type: String, required: true },
    archetype: { type: String, enum: ['Manipulator', 'Recruiter', 'Transporter', 'Financier'], required: true },
    similarityScore: Number,
    riskLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] },
    violencePotential: String,
    reoffendingProbability: Number,
    behaviorHistory: [String],
    associatedCrimes: [String],
    aiExplanation: String
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
