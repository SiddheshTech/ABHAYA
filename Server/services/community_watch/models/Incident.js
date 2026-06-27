const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
    incidentId: { type: String, required: true },
    title: { type: String, required: true },
    loc: { type: String, required: true },
    status: { type: String, default: 'Verified' },
    time: { type: String, default: '1 hr ago' }
});

module.exports = mongoose.model('Incident', incidentSchema);
