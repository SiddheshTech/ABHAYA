const mongoose = require('mongoose');

const recoverySchema = new mongoose.Schema({
    child: { type: String, required: true },
    sector: { type: String, required: true },
    status: { type: String, default: 'Verified' },
    time: { type: String, default: 'Just Now' }
});

module.exports = mongoose.model('Recovery', recoverySchema);
