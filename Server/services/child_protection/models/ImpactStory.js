const mongoose = require('mongoose');

const impactStorySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    targetNum: { type: Number, required: true },
    textEn: { type: String, required: true },
    textHi: { type: String, required: true },
    bgColor: { type: String, required: true },
    badgeColor: { type: String, required: true },
    iconType: { type: String, required: true }
}, { timestamps: true });

impactStorySchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('ImpactStory', impactStorySchema);
