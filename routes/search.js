const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
    const userPhone = req.query.phone;

    if (!userPhone) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    try {
        // Get phone information
        const msidnResponse = await axios.get(`https://script.google.com/macros/s/AKfycbwx_d7KPLH1x2AjCf8yfAAvOCueZZxteegaormYL3i9xf2ejkMwodJVHPB0OZeEZ_Pc_A/exec?no=${userPhone}`);
        const msidnData = msidnResponse.data;

        // Get e-wallet information (excluding DANA)
        const bankCodes = ['GOPAY', 'OVO', 'SHOPEEPAY', 'KASPRO', 'LINKAJA'];
        const walletResults = {};
        let index = 1;

        for (const bankCode of bankCodes) {
            try {
                const walletResponse = await axios.get(`https://api-rekening.lfourr.com/getEwalletAccount?bankCode=${bankCode}&accountNumber=${userPhone}`);
                const walletData = walletResponse.data;

                if (walletData.msg !== 'Data yang anda masukan tidak sesuai!') {
                    walletResults[index] = walletData.data.accountname;
                    index++;
                }
            } catch (error) {
                console.error(`Error fetching wallet data from ${bankCode}:`, error.message);
            }
        }

        // New API call to get KomInfo Indonesia data
        const kominfoData = await getKominfoData(userPhone);

        const combinedResponse = {
            status: 200,
            data: {
                type: msidnData.type || "mobile",
                city: msidnData.city || "Unknown",
                prov: msidnData.provider || "Unknown",
                time: msidnData.timezone || "Asia/Jakarta"
            },
            leak: {
                nik: kominfoData.Passport || null,
                reg: kominfoData.RegDate || null
            },
            name: walletResults
        };

        res.json(combinedResponse);
    } catch (error) {
        res.status(400).json({ error: 'Failed to get combined data' });
    }
});

// Function to get KomInfo Indonesia data
async function getKominfoData(userPhone) {
    const data = {
        token: "5256936828:mK79GQ0Z",
        request: userPhone,
        limit: 100,
        lang: "en"
    };
    const url = 'https://leakosintapi.com/';
    
    try {
        const response = await axios.post(url, data);
        const kominfoResponse = response.data; // Assuming response.data contains the relevant data

        // Extracting only the relevant fields from "KomInfo Indonesia"
        const kominfoIndonesia = kominfoResponse.List['KomInfo Indonesia'].Data[0]; // Get the first item

        // Return only the relevant data
        return {
            Passport: kominfoIndonesia.Passport,
            Phone: kominfoIndonesia.Phone,
            Provider: kominfoIndonesia.Provider,
            RegDate: kominfoIndonesia.RegDate
        };
    } catch (error) {
        console.error('Error fetching KomInfo data:', error.message);
        return {}; // Return an empty object if there's an error
    }
}

module.exports = router;