const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, enum: ['Active', 'En Route', 'Idle'], required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    battery: { type: Number, required: true }
}, { timestamps: true });

teamSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Team', teamSchema);
