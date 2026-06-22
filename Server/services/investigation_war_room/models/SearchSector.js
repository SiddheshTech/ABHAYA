const mongoose = require('mongoose');

const searchSectorSchema = new mongoose.Schema({
  sectorId: { type: String, required: true },
  missionId: { type: String, required: true },
  polygon: {
    type: { type: String, enum: ['Polygon'], default: 'Polygon' },
    coordinates: { type: [[[Number]]], required: true } // GeoJSON Polygon
  },
  status: {
    type: String,
    enum: ['Unsearched', 'In Progress', 'Completed', 'Needs Recheck'],
    default: 'Unsearched'
  },
  assignedTeamId: { type: String },
  coveragePercentage: { type: Number, default: 0 },
  terrainDifficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard', 'Extreme'] },
  missProbability: { type: Number, min: 0, max: 100 }
}, { timestamps: true });

// 2dsphere index
searchSectorSchema.index({ polygon: '2dsphere' });

module.exports = mongoose.model('SearchSector', searchSectorSchema);
