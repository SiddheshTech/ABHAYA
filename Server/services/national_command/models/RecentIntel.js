const mongoose = require('mongoose');

const recentIntelSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    timestamp: { type: String, required: true },
    officer: { type: String, required: true },
    status: { type: String, required: true },
    bookmarked: { type: Boolean, default: false },
    summary: { type: String, required: true },
    metadata: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('RecentIntel', recentIntelSchema);
