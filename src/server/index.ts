import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import connectionRoutes from './routes/connection';
import settingsRoutes from './routes/settings';
import mediaRoutes from './routes/media';
import playerRoutes from './routes/player';
import statusRoutes from './routes/status';
import networkRoutes from './routes/network';
import adminRoutes from './routes/admin';
import aboutRoutes from './routes/about';
import wifiRoutes from './routes/wifi';
import { externalApi } from './services/externalApiService';

const app = express();
const PORT = process.env.PORT || 3000;
// Trigger restart

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../client')));

// API Routes
app.use('/api/connection', connectionRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/player', playerRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/network', networkRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/wifi', wifiRoutes);

// Proxy endpoints - forward to external device
app.post('/api/reboot', async (req: any, res: any) => {
    try {
        const option = req.body.option || 1;
        const result = await externalApi.reboot(option);
        res.json(result || { success: false, error: 'Reboot request sent but no response' });
    } catch (error: any) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to reboot device', 
            message: error.message 
        });
    }
});

app.get('/api/logs', async (req: any, res: any) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const result = await externalApi.getLogs(limit);
        res.json(result || { success: false, error: 'Failed to get logs' });
    } catch (error: any) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to get logs', 
            message: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});