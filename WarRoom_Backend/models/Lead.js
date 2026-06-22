const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['Sighting', 'Anonymous Tip', 'Witness Report', 'Media Upload'],
    required: true
  },
  status: {
    type: String,
    enum: ['Unverified', 'AI Reviewed', 'Officer Reviewed', 'Verified'],
    default: 'Unverified'
  },
  location: { type: String },
  confidence: { type: Number, min: 0, max: 100 },
  distanceFromLastSeenKm: { type: Number },
  linkedCaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
  aiRecommendation: {
    action: { type: String, enum: ['Escalate', 'Merge', 'Archive', 'Request Verification'] },
    reasoning: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
