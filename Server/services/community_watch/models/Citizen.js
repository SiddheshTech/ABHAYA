const mongoose = require('mongoose');

const citizenSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    trustScore: { type: Number, default: 50 },
    communityRank: { type: String, enum: ['Helper', 'Protector', 'Guardian', 'Champion', 'Hero'], default: 'Helper' },
    verificationStatus: { type: String, enum: ['Unverified', 'Verified'], default: 'Unverified' },
    impact: {
        tipsSubmitted: { type: Number, default: 0 },
        verifiedSightings: { type: Number, default: 0 },
        childrenHelped: { type: Number, default: 0 },
        alertsShared: { type: Number, default: 0 }
    },
    badges: [{ type: String }],
    impactTimeline: [{
        month: String,
        description: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Citizen', citizenSchema);
