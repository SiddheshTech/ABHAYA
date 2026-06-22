const mongoose = require('mongoose');

const sightingSchema = new mongoose.Schema({
    citizenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Citizen', required: true },
    alertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Alert' },
    photoUrl: { type: String },
    videoUrl: { type: String },
    voiceNoteUrl: { type: String },
    location: { type: String, required: true },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number }
    },
    aiAnalysis: {
        possibleMatch: { type: Boolean, default: false },
        confidenceScore: { type: Number, default: 0 },
        relatedCaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Alert' }
    },
    status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Sighting', sightingSchema);
