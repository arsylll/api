const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Home endpoint
app.get('/', (req, res) => {
    const endpoints = [
        { path: '/wallet?phone=', type: 'GET', desc: 'Get e-wallet information' },
        { path: '/parse?nik=', type: 'GET', desc: 'Get identity information' },
        { path: '/msidn?phone=', type: 'GET', desc: 'Get phone number information' },
        { path: '/address?ip=', type: 'GET', desc: 'Get public IP information' },
        { path: '/pln?id=', type: 'GET', desc: 'Get PLN username information' }
    ];
    res.json({ endpoints });
});

// Combined endpoint to get both MSIDN and Wallet information
// Combined endpoint to get both MSIDN and Wallet information
app.get('/search', async (req, res) => {
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

        let index = 1; // Initialize index for naming
        for (const bankCode of bankCodes) {
            try {
                const walletResponse = await axios.get(`https://api-rekening.lfourr.com/getEwalletAccount?bankCode=${bankCode}&accountNumber=${userPhone}`);
                const walletData = walletResponse.data;

                if (walletData.msg !== 'Data yang anda masukan tidak sesuai!') {
                    walletResults[index] = walletData.data.accountname; // Use index for naming
                    index++; // Increment index for next entry
                }
            } catch (error) {
                console.error(`Error fetching wallet data from ${bankCode}:`, error.message);
            }
        }

        // Combine the results
        const combinedResponse = {
            status: 200,
            data: {
                code: msidnData.number_code || "62", // Default to "62" if not available
                type: msidnData.type || "mobile",
                city: msidnData.city || "Unknown",
                prov: msidnData.provider || "Unknown",
                time: msidnData.timezone || "Asia/Jakarta"
            },
            name: walletResults // Change to 'name' as per your request
        };

        res.json(combinedResponse);
    } catch (error) {
        res.status(400).json({ error: 'Failed to get combined data' });
    }
});

// Get e-wallet information
app.get('/wallet', async (req, res) => {
    const userPhone = req.query.phone;
    if (!userPhone) {
        return res.status(400).json({ error: 'User  phone is required' });
    }

    const bankCodes = ['DANA', 'GOPAY', 'OVO', 'SHOPEEPAY', 'KASPRO', 'LINKAJA'];
    const results = [];

    for (const bankCode of bankCodes) {
        try {
            const response = await axios.get(`https://api-rekening.lfourr.com/getEwalletAccount?bankCode=${bankCode}&accountNumber=${userPhone}`);
            const data = response.data;

            if (data.msg === 'Data yang anda masukan tidak sesuai!') {
                continue;
            }

            results.push({
                name: data.data.accountname,
                bank: data.data.bankcode
            });
        } catch (error) {
            results.push({ error: `Failed to get data from ${bankCode}` });
        }
    }

    res.json(results);
});

// Get identity information
app.get('/parse', async (req, res) => {
    const userNIK = req.query.nik;
    if (!userNIK) {
        return res.status(400).json({ error: 'NIK is required' });
    }

    try {
        // First API call to get identity information
        const identityResponse = await axios.get(`https://skizoasia.xyz/api/checknik?apikey=arsyl&nik=${userNIK}`);
        const originalData = identityResponse.data;

        // Create the modified response for identity information
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
            parse: {} // Placeholder for additional data
        };

        // Second API call to get additional information
        const additionalResponse = await axios.get(`https://script.google.com/macros/s/AKfycbwwGKJ6JU7xyfpl_fwQpjsOjzoHZAUzTyOsnXJnbNuDyTx8aqvx5OX8TXHGKUT-OTh5/exec?nik=${userNIK}`);
        
        // Extract additional data
        const additionalData = additionalResponse.data;

        // Add additional data to the modified response
        modifiedResponse.parse = {
            pasaran: additionalData.pasaran,
            usia: additionalData.usia,            
            kodepos: additionalData.kodepos,
            ultah: additionalData.ultah,
            zodiak: additionalData.zodiak,
            uniqcode: additionalData.uniqcode
        };

        // Send the combined response
        res.json(modifiedResponse);
    } catch (error) {
        res.status(400).json({ error: 'Failed to get data from identity API or additional data API' });
    }
});

// Get phone information
app.get('/msidn', async (req, res) => {
    const userPhone = req.query.phone;
    if (!userPhone) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    try {
        const response = await axios.get(`https://script.google.com/macros/s/AKfycbwx_d7KPLH1x2AjCf8yfAAvOCueZZxteegaormYL3i9xf2ejkMwodJVHPB0OZeEZ_Pc_A/exec?no=${userPhone}`);
        res.json(response.data);
    } catch (error) {
        res.status(400).json({ error: 'Failed to get data from phone API' });
    }
});

// Get IP information
app.get('/address', async (req, res) => {
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

// Get mobile game nickname information
app.get('/pln', async (req, res) => {
    const userID = req.query.id;
    if (!userID) {
        return res.status(400).json({ error: 'User  ID is required' });
    }

    const url = "https://api-mobile-game-nickname-checker.p.rapidapi.com/token-pln";
    const options = {
        headers: {
            "x-rapidapi-key": "7f9ad50827msha3e8506009f4f56p1d825fjsn3c2a34deadd1",
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});