const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
import connectionRoutes from './routes/connection';
import settingsRoutes from './routes/settings';
import mediaRoutes from './routes/media';
import playerRoutes from './routes/player';
import statusRoutes from './routes/status';
import networkRoutes from './routes/network';
import adminRoutes from './routes/admin';
import aboutRoutes from './routes/about';
import { authenticate } from './middleware/auth';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../client')));
app.use('/api/connection', connectionRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/player', playerRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/network', networkRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/about', aboutRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});