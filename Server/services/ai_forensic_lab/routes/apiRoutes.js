const express = require('express');
const router = express.Router();
const AIReconstruction = require('../models/AIReconstruction');

router.get('/reconstructions', async (req, res) => {
    try {
        const data = await AIReconstruction.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
