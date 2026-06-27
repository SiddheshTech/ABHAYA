const mongoose = require('mongoose');

const securityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: String, required: true },
  ip: { type: String },
  status: { type: String, enum: ['Success', 'Failed'], default: 'Success' },
  type: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('SecurityLog', securityLogSchema);
