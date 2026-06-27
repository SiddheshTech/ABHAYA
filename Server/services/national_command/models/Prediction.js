const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    targetState: { type: String, required: true },
    expectedSpike: { type: String }, // e.g. "3 Weeks"
    confidenceScore: { type: Number }, // e.g. 87%
    riskFactors: {
        weatherRisk: { type: String },
        migrationRisk: { type: String },
        economicDistress: { type: String },
        conflictRisk: { type: String }
    },
    recommendations: [{ type: String }],
    forecastPeriod: { type: String, default: '1 Month' }
}, { timestamps: true });

module.exports = mongoose.model('Prediction', predictionSchema);
