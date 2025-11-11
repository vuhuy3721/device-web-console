import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

export class NetworkController {
    public getNetworkInfo(req: Request, res: Response): void {
        try {
            const settingsPath = path.join(__dirname, '../config/settings.json');
            const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

            const networkInfo = {
                type: settings.mobile_mode === 3 ? '4G/LTE' : '3G',
                provider: 'Mobifone',
                signal: 'Strong (-85 dBm)',
                connected: settings.disabled === 0,
                simCard: settings.sim === 0 ? 'SIM 1' : 'SIM 2',
                roaming: false,
                dataUsage: '2.5 GB',
                ipAddress: '192.168.1.100',
                gateway: '192.168.1.1',
                dns1: '8.8.8.8',
                dns2: '8.8.4.4',
                mqttConnected: true,
                bootstrapServer: settings.bootstrap_server,
                externalId: settings.external_id,
                timestamp: new Date().toISOString()
            };
            res.json(networkInfo);
        } catch (error: any) {
            res.status(500).json({ error: 'Failed to retrieve network info', message: error.message });
        }
    }

    public updateNetworkSettings(req: Request, res: Response): void {
        try {
            const settingsPath = path.join(__dirname, '../config/settings.json');
            const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
            
            const { mobileMode, sim } = req.body;
            
            if (mobileMode !== undefined) {
                settings.mobile_mode = mobileMode;
            }
            if (sim !== undefined) {
                settings.sim = sim;
            }
            
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            res.json({ message: 'Network settings updated', timestamp: new Date().toISOString() });
        } catch (error: any) {
            res.status(500).json({ error: 'Failed to update network settings', message: error.message });
        }
    }

    public checkNetworkStatus(req: Request, res: Response): void {
        try {
            const settingsPath = path.join(__dirname, '../config/settings.json');
            const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

            const status = {
                online: settings.disabled === 0,
                latency: '25ms',
                packetLoss: '0%',
                throughput: 'Good',
                signal: 'Strong',
                timestamp: new Date().toISOString()
            };
            res.json(status);
        } catch (error: any) {
            res.status(500).json({ error: 'Failed to check network status', message: error.message });
        }
    }
}

export default new NetworkController();