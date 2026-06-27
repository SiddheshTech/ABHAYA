const mongoose = require('mongoose');

const savedReportSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: String, required: true },
    size: { type: String, required: true },
    version: { type: Number, default: 1 },
    versionHistory: [{
        version: Number,
        date: String,
        author: String,
        changes: String
    }],
    status: { type: String, required: true },
    signature: {
        signedBy: String,
        timestamp: String,
        hash: String
    },
    content: { type: String, required: true },
    tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('SavedReport', savedReportSchema);
