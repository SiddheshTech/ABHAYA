const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    text: { type: String, required: true },
    time: { type: String, required: true }
});

const ticketSchema = new mongoose.Schema({
    ticketId: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    category: { type: String, required: true },
    priority: { type: String, required: true },
    status: { type: String, default: 'Open' },
    created: { type: String, required: true },
    messages: [messageSchema]
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
