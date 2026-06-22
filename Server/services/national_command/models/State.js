const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g. "Maharashtra"
    missingCases: { type: Number, default: 0 },
    recoveredCases: { type: Number, default: 0 },
    networksDetected: { type: Number, default: 0 },
    riskIndex: { type: String, enum: ['Safe', 'Watchlist', 'High Risk', 'Emergency'], default: 'Safe' },
    activeOperations: { type: Number, default: 0 },
    coordinates: { lat: Number, lng: Number } // For Live India Grid
}, { timestamps: true });

// Virtual for recovery rate
stateSchema.virtual('recoveryRate').get(function() {
    const total = this.missingCases + this.recoveredCases;
    return total === 0 ? 0 : Math.round((this.recoveredCases / total) * 100);
});
stateSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('State', stateSchema);
