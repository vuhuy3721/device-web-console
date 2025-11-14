import { Request, response, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const EXTERNAL_API_URL = 'http://100.78.142.94:8080';

export class NetworkController {
    public getNetworkInfo(req: Request, res: Response): void {
        try {
            const settingsPath = path.join(__dirname, '../config/settings.json');
            const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
            const infoPath = path.join(__dirname, '../config/info.json');
            const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
            const networkInfo = {
                imei: info.gsm_imei || 'unknown',
                model: info.gsm_model || 'unknown',
                revision: info.gsm_revision || 'unknown',
                imsi: settings.gsm_imsi || 'unknown',
                phoneNumber: settings.gsm_phone || 'unknown',
                gsmStatus: settings.gsm_status || 'unknown'
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

    public async sendATCommand(req: Request, res: Response): Promise<void> {
        const { command, timeout } = req.body;
        
        if (!command) {
            res.status(400).json({ error: 'AT command is required' });
            return;
        }

        try {
            console.log(`Executing AT command: ${command} with timeout: ${timeout}s`);
            const response = await fetch(`${EXTERNAL_API_URL}/api/atcommand`, 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ command, timeout })
                });
            
            if (!response.ok) {
                res.status(500).json({ error: `Failed to execute AT command: ${response.statusText}` });
                return;
            }
            
            const data = await response.json();
            res.json(data);
        } catch (error: any) {
            console.error('AT Command error:', error);
            res.status(500).json({
                error: 'Failed to execute AT command',
                message: error.message
            });
        }
    }
}

export default new NetworkController();