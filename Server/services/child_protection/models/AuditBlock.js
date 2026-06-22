const mongoose = require('mongoose');

const auditBlockSchema = new mongoose.Schema({
    index: {
        type: Number,
        required: true,
        unique: true
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    },
    data: {
        type: Object,
        required: true
    },
    previousHash: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('AuditBlock', auditBlockSchema);
