const Sighting = require('../models/Sighting');
const Citizen = require('../models/Citizen');
const { addBlock } = require('../services/blockchain');

exports.submitSighting = async (req, res) => {
    try {
        const sighting = new Sighting(req.body);
        
        // Mock AI Check
        sighting.aiAnalysis = {
            possibleMatch: Math.random() > 0.5,
            confidenceScore: Math.floor(Math.random() * (99 - 50 + 1) + 50)
        };

        await sighting.save();

        // Update Citizen impact
        await Citizen.findByIdAndUpdate(sighting.citizenId, { $inc: { 'impact.tipsSubmitted': 1 } });

        // Log to blockchain
        await addBlock({ eventType: 'SIGHTING_SUBMITTED', sightingId: sighting._id, citizenId: sighting.citizenId, timestamp: new Date() });

        res.status(201).json(sighting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
