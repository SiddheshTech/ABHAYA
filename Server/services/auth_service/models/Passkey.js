const mongoose = require('mongoose');

const passkeySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  added: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Passkey', passkeySchema);
