const Alert = require('../models/Alert');
const FeedItem = require('../models/FeedItem');
const { addBlock } = require('../services/blockchain');

exports.reportMissingChild = async (req, res) => {
    try {
        const { photoUrl, name, age, gender, location, coordinates, lastSeenDate, specialConditions } = req.body;
        
        const alert = new Alert({
            photoUrl, name, age, gender, location, coordinates, lastSeenDate, specialConditions, riskLevel: 'High'
        });
        await alert.save();

        const feedItem = new FeedItem({
            type: 'Emergency Alert',
            title: `Missing Child: ${name}`,
            description: `Last seen at ${location}. Please keep an eye out.`,
            mediaUrl: photoUrl,
            relatedAlertId: alert._id,
            location
        });
        await feedItem.save();

        await addBlock({ eventType: 'MISSING_CHILD_REPORTED', alertId: alert._id, timestamp: new Date() });

        res.status(201).json({ alert, status: 'Case Created, Alert Issued' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
