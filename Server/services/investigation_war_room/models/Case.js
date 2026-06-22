const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  caseId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number },
  hoursMissing: { type: Number, default: 0 },
  riskScore: { type: Number, min: 0, max: 100, default: 50 },
  status: { 
    type: String, 
    enum: ['Active', 'Escalated', 'Recovered', 'Cold'], 
    default: 'Active' 
  },
  state: { type: String },
  district: { type: String },
  officerAssigned: { type: String },
  photoUrl: { type: String },
  lastSeenLocation: { type: String },
  mostRecentLead: { type: String },
  timeline: [{
    event: { type: String }, // e.g., 'Reported', 'Verified', 'Sighting Found'
    timestamp: { type: Date, default: Date.now }
  }],
  aiPredictions: {
    likelyRoute: { type: String },
    confidence: { type: Number },
    recommendedAction: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Case', caseSchema);
