const FeedItem = require('../models/FeedItem');
const Alert = require('../models/Alert');
const Sighting = require('../models/Sighting');
const Citizen = require('../models/Citizen');

exports.getGlobalStats = async (req, res) => {
    try {
        const childrenReunited = 1247 + await Alert.countDocuments({ status: 'Recovered' });
        const activeVolunteers = 18421 + await Citizen.countDocuments();
        const sightingsVerified = 94 + await Sighting.countDocuments({ status: 'Verified', createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) } });

        res.json({
            childrenReunited,
            activeVolunteers,
            sightingsVerified
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFeed = async (req, res) => {
    try {
        const feed = await FeedItem.find().sort({ timestamp: -1 }).populate('relatedAlertId').populate('relatedCitizenId');
        
        const communityActivity = {
            tipsSubmitted: await Sighting.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) } }),
            verifiedSightings: await Sighting.countDocuments({ status: 'Verified', createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) } }),
            childrenLocatedToday: await Alert.countDocuments({ status: 'Recovered', updatedAt: { $gte: new Date(new Date().setHours(0,0,0,0)) } })
        };

        res.json({ feed, communityActivity });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
