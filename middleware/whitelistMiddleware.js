const fs = require('fs');
const path = require('path');

const whitelistFilePath = path.join(__dirname, '../whitelist.json');
let whitelistedIPs = new Set();

const loadWhitelistedIPs = () => {
    if (fs.existsSync(whitelistFilePath)) {
        const data = fs.readFileSync(whitelistFilePath, 'utf-8');
        whitelistedIPs = new Set(JSON.parse(data));
    }
};

loadWhitelistedIPs();

const whitelistMiddleware = (req, res, next) => {
    const ip = req.ip;

    if (req.path === '/whitelist') {
        return next();
    }

    if (!whitelistedIPs.has(ip)) {
        return res.status(403).json({ access: `IP ${ip} not whitelisted` });
    }

    next();
};

module.exports = whitelistMiddleware;