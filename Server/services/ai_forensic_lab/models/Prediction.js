const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    timeframe: { type: String, required: true },
    timestamp: { type: String },
    migrationRisk: {
        level: String,
        trend: String,
        confidence: Number,
        reasoning: String,
        factors: [String],
        regions: [String],
        timeline: String,
        actions: String
    },
    floodRisk: {
        probability: Number,
        rainfall: String,
        riverLevels: String,
        satelliteData: String,
        districts: [String],
        forecast: String,
        impactAssessment: String
    },
    economicDistress: {
        vulnerabilityScore: Number,
        employment: String,
        migration: String,
        inflation: String,
        foodSupply: String,
        povertyIndex: String,
        trendCharts: [Number]
    },
    socialUnrest: {
        riskScore: Number,
        socialMedia: String,
        crimeReports: String,
        protestMonitoring: String,
        sentimentAnalysis: String,
        communityAlerts: String
    },
    predictedCases: {
        value: Number,
        changePercent: String,
        confidence: Number,
        historicalComparison: String,
        weeklyForecast: [Number],
        monthlyForecast: [Number]
    },
    expectedLocations: [{
        name: String,
        probability: Number,
        confidence: Number,
        expectedTime: String,
        distance: String,
        lastActivity: String,
        details: String
    }],
    threatProbability: {
        gaugeValue: Number,
        trend: String,
        forecast: String,
        riskContributors: [String],
        mitigationSuggestions: String
    },
    confidenceScore: {
        accuracy: String,
        freshness: String,
        level: String,
        reliability: String,
        quality: String,
        modelVersion: String
    },
    aiExplanation: String
}, { timestamps: true });

module.exports = mongoose.model('Prediction', predictionSchema);
