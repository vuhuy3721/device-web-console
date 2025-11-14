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
import remoteRoutes from './routes/remote';
import mgwRoutes from './routes/mgw';
import wifiRoutes from './routes/wifi';
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
// app.use('/api/remote', remoteRoutes); // Remote management API
// app.use('/api/mgw', mgwRoutes); // MGW data receiver
app.use('/api/wifi', wifiRoutes); // WiFi management API

// Reboot endpoint - forwards to external device
app.post('/api/reboot', async (req: any, res: any) => {
    try {
        const option = req.body.option || 1;
        const response = await fetch('http://100.78.142.94:8080/api/reboot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ option })
        });
        const data = await response.json();
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ success: false, error: 'Failed to reboot device', message: error.message });
    }
});

// Logs endpoint - forwards to external device
app.get('/api/logs', async (req: any, res: any) => {
    try {
        const limit = req.query.limit || 50;
        const response = await fetch(`http://100.78.142.94:8080/api/logs?limit=${limit}`);
        const data = await response.json();
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ success: false, error: 'Failed to get logs', message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});