const mongoose = require('mongoose');

const riskForecastSchema = new mongoose.Schema({
  district: { type: String, required: true },
  timeframe: { 
    type: String, 
    enum: ['24 Hours', '72 Hours', '1 Week', '1 Month', '4-8 Weeks'],
    required: true
  },
  factors: {
    migrationRisk: { type: Number, min: 0, max: 100 },
    floodRisk: { type: Number, min: 0, max: 100 },
    economicDistress: { type: Number, min: 0, max: 100 },
    socialUnrest: { type: Number, min: 0, max: 100 }
  },
  forecast: {
    traffickingRiskLevel: { type: String, enum: ['Low', 'Moderate', 'High', 'Critical'] },
    threatProbability: { type: Number, min: 0, max: 100 },
    predictedCasesCount: { type: Number },
    expectedLocations: [{ type: String }],
    recommendedAction: { type: String }
  }
}, { timestamps: true });

// Text index for Intelligence Archive
riskForecastSchema.index({ '$**': 'text' });

module.exports = mongoose.model('RiskForecast', riskForecastSchema);
