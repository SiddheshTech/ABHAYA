const mongoose = require('mongoose');

const genomeMutationSchema = new mongoose.Schema({
  networkId: { type: String, required: true },
  status: {
    type: String,
    enum: ['Emerging', 'Recently Mutated', 'Dormant', 'Rapid Growth'],
    default: 'Emerging'
  },
  metrics: {
    kingpinDetected: { type: Boolean, default: false },
    networkStrength: { type: Number, min: 0, max: 100 },
    collapsePointProbability: { type: Number, min: 0, max: 100 },
    mutationRisk: { type: Number, min: 0, max: 100 }
  },
  forecast: {
    mutationProbability: { type: Number, min: 0, max: 100 },
    expectedShiftRoute: { type: String },
    predictedExpansionArea: { type: String }
  }
}, { timestamps: true });

// Text index for Intelligence Archive
genomeMutationSchema.index({ '$**': 'text' });

module.exports = mongoose.model('GenomeMutation', genomeMutationSchema);
