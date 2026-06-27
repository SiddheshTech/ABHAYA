const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    priority: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'], required: true },
    area: { type: String, required: true },
    progress: { type: Number, required: true },
    status: { type: String, enum: ['Active', 'Pending', 'Completed'], required: true },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number }
    },
    assignedTeam: { type: String },
    logs: [{ type: String }]
}, { timestamps: true });

missionSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Mission', missionSchema);
