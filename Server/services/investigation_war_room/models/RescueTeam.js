const mongoose = require('mongoose');

const rescueTeamSchema = new mongoose.Schema({
  teamId: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ['Ground', 'Drone', 'Canine', 'Police', 'Medical'],
    required: true
  },
  status: {
    type: String,
    enum: ['Ready', 'On Mission', 'Returning', 'Offline'],
    default: 'Ready'
  },
  personnelCount: { type: Number },
  batteryOrFuelLevel: { type: Number, min: 0, max: 100 },
  coverageRadiusKm: { type: Number },
  currentMissionId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('RescueTeam', rescueTeamSchema);
