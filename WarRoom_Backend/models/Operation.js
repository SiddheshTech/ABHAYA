const mongoose = require('mongoose');

const operationSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Available', 'On Mission', 'Returning', 'Standby'],
    default: 'Standby'
  },
  currentMission: {
    searchZone: { type: String },
    etaMinutes: { type: Number },
    expectedCoverage: { type: Number, min: 0, max: 100 },
    successProbability: { type: Number, min: 0, max: 100 }
  },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  }
}, { timestamps: true });

module.exports = mongoose.model('Operation', operationSchema);
