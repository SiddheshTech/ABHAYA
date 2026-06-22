const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  index: { type: Number, required: true, unique: true },
  timestamp: { type: Date, default: Date.now },
  data: { type: Object, required: true }, // The evidence or timeline event details
  previousHash: { type: String, required: true },
  hash: { type: String, required: true }
});

module.exports = mongoose.model('Block', blockSchema);
