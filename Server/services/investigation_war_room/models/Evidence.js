const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  type: { 
    type: String, 
    enum: ['Photo', 'Video', 'Audio', 'Document', 'DeviceDump'], 
    required: true 
  },
  url: { type: String, required: true },
  metadata: {
    location: { type: String },
    timestamp: { type: Date }
  },
  uploaderId: { type: String, required: true },
  aiAnalysis: {
    facesDetected: [String],
    vehiclesIdentified: [String],
    textExtracted: String,
    objectsDetected: [String]
  },
  chainOfCustodyHash: { type: String } // Links to the blockchain record
}, { timestamps: true });

module.exports = mongoose.model('Evidence', evidenceSchema);
