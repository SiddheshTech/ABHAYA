const mongoose = require('mongoose');

const criminalProfileSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }
}, { strict: false, timestamps: true });

criminalProfileSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('CriminalProfile', criminalProfileSchema);
