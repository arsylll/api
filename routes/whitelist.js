const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const whitelistFilePath = path.join(__dirname, '../whitelist.json');
let whitelistedIPs = new Set();

const saveWhitelistedIPs = () => {
    fs.writeFileSync(whitelistFilePath, JSON.stringify(Array.from(whitelistedIPs), null, 2));
};

const loadWhitelistedIPs = () => {
    if (fs.existsSync(whitelistFilePath)) {
        const data = fs.readFileSync(whitelistFilePath, 'utf-8');
        whitelistedIPs = new Set(JSON.parse(data));
    }
};

loadWhitelistedIPs();

router.post('/', (req, res) => {
    const ipToWhitelist = req.query.ip;

    if (!ipToWhitelist) {
        return res.status(400).json({ error: 'IP address is required' });
    }

    whitelistedIPs.add(ipToWhitelist);
    saveWhitelistedIPs();
    res.json({ message: `IP ${ipToWhitelist} has been added to the whitelist.` });
});

module.exports = router;