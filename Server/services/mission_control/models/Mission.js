const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
    missionId: { type: String, required: true, unique: true },
    searchRadiusKm: Number,
    coveragePercent: Number,
    successProbability: Number,
    recommendedDeployment: String,
    status: { type: String, enum: ['Active', 'Completed', 'Critical'], default: 'Active' },
    coordinates: { lat: Number, lng: Number }
}, { timestamps: true });

module.exports = mongoose.model('Mission', missionSchema);
