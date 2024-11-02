const express = require('express');
const cors = require('cors');
const whitelistMiddleware = require('./middleware/whitelistMiddleware');
const homeRoutes = require('./routes/home');
const searchRoutes = require('./routes/search');
const trackRoutes = require('./routes/track');
const parseRoutes = require('./routes/parse');
const addressRoutes = require('./routes/address');
const plnRoutes = require('./routes/pln');
const whitelistRoutes = require('./routes/whitelist');

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy')

app.use(cors());
app.use(express.json());
app.use(whitelistMiddleware);

app.use('/', homeRoutes);
app.use('/search', searchRoutes);
app.use('/track', trackRoutes);
app.use('/parse', parseRoutes);
app.use('/address', addressRoutes);
app.use('/pln', plnRoutes);
app.use('/whitelist', whitelistRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});