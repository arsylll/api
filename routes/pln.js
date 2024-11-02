const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
    const userID = req.query.id;
    if (!userID) {
        return res.status(400).json({ error: 'User  ID is required' });
    }

    const url = "https://api-mobile-game-nickname-checker.p.rapidapi.com/token-pln";
    const options = {
        headers: {
            "x-rapidapi-key": "7f9ad50827msha3e8506009f4f56p1d825fjsn3c2a34deadd1", // Replace with your actual API key
            "x-rapidapi-host": "api-mobile-game-nickname-checker.p.rapidapi.com"
        },
        params: { userId: userID }
    };

    try {
        const response = await axios.get(url, options);
        res.json(response.data);
    } catch (error) {
        res.status(400).json({ error: 'Failed to get data from nickname API' });
    }
});

module.exports = router;