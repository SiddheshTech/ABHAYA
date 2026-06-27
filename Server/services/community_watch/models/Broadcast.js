const mongoose = require('mongoose');

const broadcastSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    msg: { type: String, required: true },
    time: { type: String, default: 'Just Now' },
    level: { type: String, default: 'Info' }
});

module.exports = mongoose.model('Broadcast', broadcastSchema);
