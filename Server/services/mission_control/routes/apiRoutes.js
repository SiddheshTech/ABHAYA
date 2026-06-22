const express = require('express');
const router = express.Router();
const Mission = require('../models/Mission');

router.get('/missions', async (req, res) => {
    try {
        const data = await Mission.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
