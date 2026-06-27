const mongoose = require('mongoose');

const familyMatchSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    childId: { type: String, required: true },
    matchName: { type: String, required: true },
    relationship: { type: String, required: true },
    confidenceScore: { type: Number, required: true },
    biometricMatch: { type: Number, required: true },
    voiceMatch: { type: Number, required: true },
    status: { type: String, enum: ['Pending Verification', 'Interview Scheduled', 'Approved', 'Rejected'], required: true },
    location: { type: String, required: true }
}, { timestamps: true });

familyMatchSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('FamilyMatch', familyMatchSchema);
