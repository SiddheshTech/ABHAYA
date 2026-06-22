const State = require('../models/State');

exports.getDashboard = async (req, res) => {
    try {
        const states = await State.find();
        
        let missingChildren = 0;
        let recoveredChildren = 0;
        let networksDetected = 0;
        let riskDistricts = 0;
        let activeSearches = 0;

        states.forEach(s => {
            missingChildren += s.missingCases;
            recoveredChildren += s.recoveredCases;
            networksDetected += s.networksDetected;
            activeSearches += s.activeOperations;
            if (s.riskIndex === 'High Risk' || s.riskIndex === 'Emergency') riskDistricts++;
        });

        const rescueSuccessRate = missingChildren > 0 ? ((recoveredChildren / (missingChildren + recoveredChildren)) * 100).toFixed(1) : 0;
        const threatIndex = riskDistricts > 5 ? 'Critical' : 'Elevated';

        res.json({
            topBar: {
                missingChildren,
                recoveredChildren,
                networksDetected,
                riskDistricts,
                activeSearches,
                rescueSuccessRate: `${rescueSuccessRate}%`,
                threatIndex
            },
            mapData: states,
            nationalSituationReport: {
                hourlyRecoveries: Math.floor(Math.random() * 20) + 5,
                newNetworks: Math.floor(Math.random() * 3),
                highRiskDistricts: riskDistricts,
                activeRescueMissions: activeSearches,
                aiPredictionsTriggered: Math.floor(Math.random() * 5)
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStates = async (req, res) => {
    try {
        const states = await State.find();
        res.json(states);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
