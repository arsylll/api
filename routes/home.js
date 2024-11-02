const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const endpoints = [
        { path: '/search?phone=', type: 'GET', desc: 'Get phone number information' },
        { path: '/parse?nik=', type: 'GET', desc: 'Get identity information' },
        { path: '/track?username=', type: 'GET', desc: 'Get identity information' },
        { path: '/address?ip=', type: 'GET', desc: 'Get public IP information' },
        { path: '/pln?id=', type: 'GET', desc: 'Get PLN username information' }
    ];
    res.json({ endpoints });
});

module.exports = router;