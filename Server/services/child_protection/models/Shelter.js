const mongoose = require('mongoose');

const shelterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    currentOccupancy: { type: Number, default: 0 },
    medicalFacilities: { type: Boolean, default: false },
    staffCount: { type: Number, default: 0 },
    performanceScore: { type: Number, default: 100 },
    inspectionStatus: { type: String, enum: ['Pass', 'Fail', 'Pending'], default: 'Pending' },
    emergencyResources: { type: [String], default: [] }
}, { timestamps: true });

shelterSchema.virtual('availableBeds').get(function() {
    return this.capacity - this.currentOccupancy;
});
shelterSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Shelter', shelterSchema);
