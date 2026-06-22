const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    district: { type: String, required: true },
    traffickingRisk: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] },
    riskWindow: String, // e.g. "4-8 Weeks"
    recommendedAction: String,
    predictedCases: Number,
    threatProbability: Number,
    confidenceScore: Number,
    riskFactors: {
        migrationRisk: String,
        floodRisk: String,
        economicDistress: String,
        socialUnrest: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Prediction', predictionSchema);
