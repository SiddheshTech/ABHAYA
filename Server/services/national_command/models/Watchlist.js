const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    value: { type: String, required: true },
    status: { type: String, required: true },
    addedDate: { type: String, required: true },
    alertCount: { type: Number, default: 0 },
    tags: [String],
    riskScore: { type: Number, default: 0 },
    lastMatch: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
