const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  missionId: { type: String, required: true, unique: true },
  caseId: { type: String, required: true }, // Links to Case
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Suspended'],
    default: 'Active'
  },
  priorityLevel: { type: String, enum: ['Normal', 'High', 'Critical'], default: 'High' },
  searchRadiusKm: { type: Number, default: 5 },
  coveragePercentage: { type: Number, default: 0 },
  successProbability: { type: Number, default: 50 },
  weatherWarnings: [{ type: String }],
  recommendedDeploymentSector: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Mission', missionSchema);
