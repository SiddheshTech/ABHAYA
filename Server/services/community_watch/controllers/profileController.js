const Citizen = require('../models/Citizen');

exports.getProfile = async (req, res) => {
    try {
        const citizen = await Citizen.findById(req.params.id);
        if (!citizen) return res.status(404).json({ message: 'Citizen not found' });
        res.json(citizen);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getImpactDashboard = async (req, res) => {
    try {
        const citizen = await Citizen.findById(req.params.id);
        if (!citizen) return res.status(404).json({ message: 'Citizen not found' });
        res.json({
            impact: citizen.impact,
            badges: citizen.badges,
            rank: citizen.communityRank,
            impactTimeline: citizen.impactTimeline
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
