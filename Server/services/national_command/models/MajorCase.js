const mongoose = require('mongoose');

const majorCaseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    priority: { type: String, default: 'High' },
    status: { type: String, default: 'Operation Active' }
});

module.exports = mongoose.model('MajorCase', majorCaseSchema);
