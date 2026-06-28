const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    imgUrl: { type: String, required: true },
    titleEn: { type: String, required: true },
    titleHi: { type: String, required: true },
    descEn: { type: String, required: true },
    descHi: { type: String, required: true },
    btnTextEn: { type: String, required: true },
    btnTextHi: { type: String, required: true },
    themeColor: { type: String, required: true },
    btnBg: { type: String, required: true },
    hoverColor: { type: String, required: true },
    accentColor: { type: String, required: true },
    badgeEn: { type: String, required: true },
    badgeHi: { type: String, required: true },
    suggestedAmount: [{ type: Number }],
    statEn: { type: String, required: true },
    statHi: { type: String, required: true },
    index: { type: Number, required: true }
}, { timestamps: true });

campaignSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Campaign', campaignSchema);
