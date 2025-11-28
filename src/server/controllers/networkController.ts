import { Request, Response } from 'express';
import { storage } from '../services/storageService';
import { externalApi } from '../services/externalApiService';

/**
 * Network Controller - Manages network information and AT command interface
 * Uses StorageService for settings/info and ExternalApiService for AT commands
 */
export class NetworkController {
    /**
     * Get network information (IMEI, model, SIM details)
     * Combines data from settings.json and info.json
     */
    public async getNetworkInfo(req: Request, res: Response): Promise<void> {
        try {
            const [settings, info] = await Promise.all([
                storage.getSettings(),
                storage.getInfo()
            ]);

            if (!settings || !info) {
                res.status(500).json({ error: 'Failed to load network data' });
                return;
            }

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
            console.error('Get network info error:', error);
            res.status(500).json({ 
                error: 'Failed to retrieve network info', 
                message: error.message 
            });
        }
    }

    /**
     * Update network settings (mobile mode, SIM)
     */
    public async updateNetworkSettings(req: Request, res: Response): Promise<void> {
        try {
            const settings = await storage.getSettings();
            
            if (!settings) {
                res.status(500).json({ error: 'Failed to load settings' });
                return;
            }

            const { mobileMode, sim } = req.body;
            
            if (mobileMode !== undefined) {
                settings.mobile_mode = mobileMode;
            }
            
            if (sim !== undefined) {
                settings.sim = sim;
            }
            
            const saved = await storage.saveSettings(settings);

            if (!saved) {
                res.status(500).json({ error: 'Failed to save settings' });
                return;
            }

            res.json({ 
                message: 'Network settings updated', 
                timestamp: new Date().toISOString() 
            });
        } catch (error: any) {
            console.error('Update network settings error:', error);
            res.status(500).json({ 
                error: 'Failed to update network settings', 
                message: error.message 
            });
        }
    }

    /**
     * Check current network status
     */
    public async checkNetworkStatus(req: Request, res: Response): Promise<void> {
        try {
            const settings = await storage.getSettings();
            
            if (!settings) {
                res.status(500).json({ error: 'Failed to load settings' });
                return;
            }

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
            console.error('Check network status error:', error);
            res.status(500).json({ 
                error: 'Failed to check network status', 
                message: error.message 
            });
        }
    }

    /**
     * Send AT command to external device
     * Uses ExternalApiService to forward command to device
     */
    public async sendATCommand(req: Request, res: Response): Promise<void> {
        const { command, timeout } = req.body;
        
        if (!command) {
            res.status(400).json({ error: 'AT command is required' });
            return;
        }

        try {
            console.log(`Executing AT command: ${command} with timeout: ${timeout || 5}s`);
            
            // Use externalApi service to send AT command
            const result = await externalApi.post('/api/atcommand', { command, timeout });

            if (!result) {
                res.status(500).json({ 
                    error: 'Failed to execute AT command',
                    message: 'No response from device'
                });
                return;
            }

            res.json(result);
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
