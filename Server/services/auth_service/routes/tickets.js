const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

router.get('/', async (req, res) => {
    try {
        const tickets = await Ticket.find().sort({ createdAt: -1 });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newTicket = new Ticket(req.body);
        await newTicket.save();
        res.json(newTicket);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/:id/reply', async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
        
        ticket.messages.push(req.body);
        await ticket.save();
        res.json(ticket);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
