const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    photoUrl: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String },
    location: { type: String, required: true },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number }
    },
    lastSeenDate: { type: Date, required: true },
    riskLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Amber Alert'], default: 'High' },
    status: { type: String, enum: ['Active', 'Recovered', 'Closed'], default: 'Active' },
    specialConditions: { type: [String] },
    caseStory: { type: String },
    contactNumbers: { type: [String] },
    shares: { type: Number, default: 0 },
    verifiedSightingsCount: { type: Number, default: 0 }
}, { timestamps: true });

alertSchema.virtual('hoursMissing').get(function() {
    return Math.abs(new Date() - this.lastSeenDate) / 36e5;
});
alertSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Alert', alertSchema);
