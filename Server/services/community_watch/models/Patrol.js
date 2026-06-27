const mongoose = require('mongoose');

const patrolSchema = new mongoose.Schema({
    patrolId: { type: String, required: true },
    area: { type: String, required: true },
    volunteers: { type: Number, default: 1 },
    status: { type: String, default: 'On Patrol' },
    lastPing: { type: String, default: 'Just Now' }
});

module.exports = mongoose.model('Patrol', patrolSchema);
