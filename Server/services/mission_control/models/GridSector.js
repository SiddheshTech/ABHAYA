const mongoose = require('mongoose');

const gridSectorSchema = new mongoose.Schema({
    sectorId: { type: String, required: true, unique: true }, // e.g. "Sector A"
    status: { type: String, enum: ['Unsearched', 'In Progress', 'Completed', 'Needs Recheck'], default: 'Unsearched' },
    coveragePercent: Number,
    missProbability: Number,
    terrainDifficulty: { type: String, enum: ['Low', 'Medium', 'High', 'Severe'] },
    assignedTeam: String,
    highestProbability: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('GridSector', gridSectorSchema);
