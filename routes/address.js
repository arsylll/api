const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
    const userIP = req.query.ip;
    if (!userIP) {
        return res.status(400).json({ error: 'IP address is required' });
    }

    try {
        const response = await axios.get(`http://ipwho.is/${userIP}`);
        res.json(response.data);
    } catch (error) {
        res.status(400).json({ error: 'Failed to get data from IP API' });
    }
});

module.exports = router;