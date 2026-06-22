const mongoose = require('mongoose');

const liveTrackerSchema = new mongoose.Schema({
  entityId: { type: String, required: true },
  entityType: { 
    type: String, 
    enum: ['MissingChild', 'GroundTeam', 'DroneUnit', 'CanineUnit', 'DangerZone', 'LastSeen'],
    required: true
  },
  missionId: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  statusData: { type: Object } // E.g., battery levels, speed
}, { timestamps: true });

// 2dsphere index for Geospatial queries
liveTrackerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('LiveTracker', liveTrackerSchema);
