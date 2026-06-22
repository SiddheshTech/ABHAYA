const mongoose = require('mongoose');

const emergencyIncidentSchema = new mongoose.Schema({
  incidentId: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    enum: ['Kidnapping', 'Trafficking Alert', 'Disaster Event', 'Amber Alert', 'Red Alert'],
    required: true
  },
  level: { type: String, enum: ['Critical', 'High'], default: 'Critical' },
  status: { type: String, enum: ['Active', 'Resolved'], default: 'Active' },
  estimatedImpact: { type: String },
  authorityNotified: { type: Boolean, default: false },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number] }
  },
  blockchainHash: { type: String } // Immutable ledger record
}, { timestamps: true });

emergencyIncidentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('EmergencyIncident', emergencyIncidentSchema);
