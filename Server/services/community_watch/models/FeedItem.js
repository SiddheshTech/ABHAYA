const mongoose = require('mongoose');

const feedItemSchema = new mongoose.Schema({
    type: { type: String, enum: ['Missing Child', 'Recovery Story', 'Emergency Alert', 'Community Update', 'Search Request'], required: true },
    title: { type: String, required: true },
    description: { type: String },
    mediaUrl: { type: String },
    relatedAlertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Alert' },
    relatedCitizenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Citizen' },
    location: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FeedItem', feedItemSchema);
