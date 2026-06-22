const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamId: { type: String, required: true, unique: true },
    type: { type: String, enum: ['Drone', 'Ground', 'Canine', 'Police', 'Medical'], required: true },
    status: { type: String, enum: ['Ready', 'On Mission', 'Returning', 'Offline'], default: 'Ready' },
    batteryOrFuelLevel: Number,
    personnelCount: Number,
    coverageRadiusKm: Number,
    coordinates: { lat: Number, lng: Number }
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
