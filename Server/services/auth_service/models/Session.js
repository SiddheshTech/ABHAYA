const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  device: { type: String, required: true }, // e.g. "MacBook Pro 16"
  os: { type: String }, // e.g. "macOS"
  browser: { type: String }, // e.g. "Safari"
  ipAddress: { type: String, required: true },
  location: { type: String, default: 'Unknown' }, // e.g. "San Francisco, CA"
  isCurrent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
