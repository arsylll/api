const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
    const username = req.query.username;
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    const socialMedia = [
        { url: `https://www.facebook.com/${username}`, name: 'Facebook' },
        { url: `https://www.twitter.com/${username}`, name: 'Twitter' },
        { url: `https://www.instagram.com/${username}`, name: 'Instagram' },
        { url: `https://www.linkedin.com/in/${username}`, name: 'LinkedIn' },
        { url: `https://www.github.com/${username}`, name: 'GitHub' },
        { url: `https://www.pinterest.com/${username}`, name: 'Pinterest' },
        { url: `https://www.tumblr.com/${username}`, name: 'Tumblr' },
        { url: `https://www.youtube.com/${username}`, name: 'Youtube' },
        { url: `https://soundcloud.com/${username}`, name: 'SoundCloud' },
        { url: `https://www.snapchat.com/add/${username}`, name: 'Snapchat' },
        { url: `https://www.tiktok.com/@${username}`, name: 'TikTok' },
        { url: `https://www.behance.net/${username}`, name: 'Behance' },
        { url: `https://www.medium.com/@${username}`, name: 'Medium' },
        { url: `https://www.quora.com/profile/${username}`, name: 'Quora' },
        { url: `https://www.flickr.com/people/${username}`, name: 'Flickr' },
        { url: `https://www.periscope.tv/${username}`, name: 'Periscope' },
        { url: `https://www.twitch.tv/${username}`, name: 'Twitch' },
        { url: `https://www.dribbble.com/${username}`, name: 'Dribbble' },
        { url: `https://www.stumbleupon.com/stumbler/${username}`, name: 'StumbleUpon' },
        { url: `https://www.ello.co/${username}`, name: 'Ello' },
        { url: `https://www.producthunt.com/@${username}`, name: 'Product Hunt' },
        { url: `https://www.telegram.me/${username}`, name: 'Telegram' },
        { url: `https://www.weheartit.com/${username}`, name: 'We Heart It' }
    ];

    try {
        const results = {};

        await Promise.all(socialMedia.map(async (platform) => {
            try {
                const response = await axios.get(platform.url);
                results[platform.name] = "Available"; // Username is available
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    results[platform.name] = "Not Available"; // Username is not available
                } else {
                    results[platform.name] = "Not Available"; // Handle other errors as not available
                }
            }
        }));

        res.json(results);
    } catch (error) {
        console.error('Error checking usernames:', error);
        res.status(500).json({ error: 'An error occurred while checking usernames.' });
    }
});

module.exports = router;