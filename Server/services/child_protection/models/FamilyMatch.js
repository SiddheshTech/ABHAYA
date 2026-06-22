const mongoose = require('mongoose');

const familyCandidateSchema = new mongoose.Schema({
    familyName: { type: String, required: true },
    location: { type: String, required: true },
    confidenceScore: { type: Number, required: true },
    matchCriteria: {
        identityMatch: { type: Number, default: 0 },
        voiceMatch: { type: Number, default: 0 },
        villageMatch: { type: Number, default: 0 },
        communityMatch: { type: Number, default: 0 }
    },
    verificationStatus: { type: String, enum: ['Pending', 'In Progress', 'Verified', 'Rejected'], default: 'Pending' },
    interviewStatus: { type: String, enum: ['Pending', 'Scheduled', 'Completed'], default: 'Pending' },
    approvalStage: { type: String, enum: ['Initial Match', 'Field Verification', 'Final Approval'], default: 'Initial Match' },
    aiExplanation: {
        languageMatch: { type: String },
        regionalSimilarity: { type: String },
        behavioralIndicators: { type: String },
        historicalRecords: { type: String },
        villageCorrelation: { type: String }
    }
});

const familyMatchSchema = new mongoose.Schema({
    childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
    candidates: [familyCandidateSchema]
}, { timestamps: true });

module.exports = mongoose.model('FamilyMatch', familyMatchSchema);
