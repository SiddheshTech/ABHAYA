const mongoose = require('mongoose');

const threatEventSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., 'Cross-State Movement', 'New Criminal Links'
  level: { 
    type: String, 
    enum: ['Critical', 'High', 'Medium', 'Low'],
    required: true
  },
  description: { type: String, required: true },
  confidenceScore: { type: Number, min: 0, max: 100 },
  sources: [{ type: String }],
  affectedCases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Case' }]
}, { timestamps: true });

module.exports = mongoose.model('ThreatEvent', threatEventSchema);
