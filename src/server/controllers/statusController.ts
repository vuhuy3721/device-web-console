import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export class StatusController {
    public getStatus(req: Request, res: Response): void {
        try {
            const settingsPath = path.join(__dirname, '../config/settings.json');
            const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
            
            const uptime = process.uptime();
            const uptimeHours = Math.floor(uptime / 3600);
            const uptimeMinutes = Math.floor((uptime % 3600) / 60);

            const status = {
                uptime: `${uptimeHours} hours ${uptimeMinutes} minutes`,
                storage: `Total: 16 GB, Free: 8 GB`,
                log: `Total: 1 GB, Free: 500 MB`,
                networkType: settings.mobile_mode === 3 ? '4G/LTE' : '3G',
                bootTime: new Date(Date.now() - uptime * 1000).toISOString(),
                fmStatus: 'Active',
                speakerStatus: 'Active',
                streamBack: "On",
                deviceTemperature: '45°C',
                deviceHumidity: '40%'
            };
            res.json(status);
        } catch (error: any) {
            res.status(500).json({ error: 'Failed to retrieve status', message: error.message });
        }
    }

    public getSystemInfo(req: Request, res: Response): void {
        try {
            const systemInfo = {
                os: os.platform(),
                osRelease: os.release(),
                arch: os.arch(),
                cpus: os.cpus().length,
                totalMemory: Math.round(os.totalmem() / 1024 / 1024) + ' MB',
                freeMemory: Math.round(os.freemem() / 1024 / 1024) + ' MB',
                usedMemory: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024) + ' MB',
                memoryUsagePercent: Math.round((1 - os.freemem() / os.totalmem()) * 100) + '%',
                version: '1.0.0',
                nodeVersion: process.version,
                timestamp: new Date().toISOString()
            };
            res.json(systemInfo);
        } catch (error: any) {
            res.status(500).json({ error: 'Failed to retrieve system info', message: error.message });
        }
    }

    public getNetworkStatus(req: Request, res: Response): void {
        try {
            const settingsPath = path.join(__dirname, '../config/settings.json');
            const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
            
            const networkStatus = {
                type: settings.mobile_mode === 3 ? '4G/LTE' : '3G',
                provider: 'Mobifone',
                ipAddress: '192.168.1.100',
                simSlot: settings.sim === 0 ? 'SIM 1' : 'SIM 2',
                signalQuality: 'Excellent',
                mobileMode: settings.mobile_mode,
                externalId: settings.external_id,
                timestamp: new Date().toISOString()
            };
            res.json(networkStatus);
        } catch (error: any) {
            res.status(500).json({ error: 'Failed to retrieve network status', message: error.message });
        }
    }

    public getHealthStatus(req: Request, res: Response): void {
        const uptime = process.uptime();
        res.json({ 
            status: 'healthy', 
            uptime: Math.floor(uptime),
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        });
    }
}

export default new StatusController();