const mongoose = require('mongoose');

const droneSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    status: { type: String, required: true },
    altitude: { type: Number, required: true },
    battery: { type: Number, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    }
}, { timestamps: true });

droneSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Drone', droneSchema);
