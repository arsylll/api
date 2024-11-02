const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
    const userNIK = req.query.nik;
    if (!userNIK) {
        return res.status(400).json({ error: 'NIK is required' });
    }

    try {
        const identityResponse = await axios.get(`https://skizoasia.xyz/api/checknik?apikey=arsyl&nik=${userNIK}`);
        const originalData = identityResponse.data;

        const modifiedResponse = {
            status: originalData.status,
            data: {
                username: originalData.message.data.nik,
                kelamin: originalData.message.data.jk,
                tanggal: originalData.message.data.tgl,
                kecamatan: originalData.message.data.kec,
                kabupaten: originalData.message.data.kab,
                provinsi: originalData.message.data.prov
            },
            parse: {}
        };

        const additionalResponse = await axios.get(`https://script.google.com/macros/s/AKfycbwwGKJ6JU7xyfpl_fwQpjsOjzoHZAUzTyOsnXJnbNuDyTx8aqvx5OX8TXHGKUT-OTh5/exec?nik=${userNIK}`);
        const additionalData = additionalResponse.data;

        modifiedResponse.parse = {
            pasaran: additionalData.pasaran,
            usia: additionalData.usia,
            kodepos: additionalData.kodepos,
            ultah: additionalData.ultah,
            zodiak: additionalData.zodiak,
            uniqcode: additionalData.uniqcode
        };

        res.json(modifiedResponse);
    } catch (error) {
        res.status(400).json({ error: 'Failed to get data from identity API or additional data API' });
    }
});

module.exports = router;