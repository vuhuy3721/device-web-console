import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { connectToNetwork } from '../utils/networkUtils';

const EXTERNAL_API_URL = 'http://100.78.142.94:8080';

export class SettingsController {
    private settingsFilePath: string;

    constructor() {
        this.settingsFilePath = path.join(__dirname, '../config/settings.json');
    }

    private saveSettingsToFile(data: any): void {
        try {
            fs.writeFileSync(this.settingsFilePath, JSON.stringify(data, null, 2), 'utf8');
            console.log('Settings saved to file:', this.settingsFilePath);
        } catch (error) {
            console.error('Error saving settings to file:', error);
        }
    }

    private async fetchExternalSettings(): Promise<any> {
        try {
            const response = await fetch(`${EXTERNAL_API_URL}/api/settings`);
            if (!response.ok) {
                console.warn(`Failed to fetch external settings: ${response.statusText}`);
                return null;
            }
            return await response.json();
        } catch (error) {
            console.warn('Error fetching from external API:', error);
            return null;
        }
    }

    public getSettings = async (req: Request, res: Response): Promise<void> => {
        try {
            // Try to fetch from external API first
            const externalResponse = await this.fetchExternalSettings();

            if (externalResponse && externalResponse.success && externalResponse.data) {
                // Response from external API has format: { success: true, data: {...}, timestamp: ... }
                const settingsData = externalResponse.data;
                
                // Save to file
                this.saveSettingsToFile(settingsData);
                
                res.json(settingsData);
                return;
            }

            // Fallback to local data
            fs.readFile(this.settingsFilePath, 'utf8', (err, data) => {
                if (err) {
                    res.status(500).json({ error: 'Failed to read settings' });
                    return;
                }
                try {
                    const settings = JSON.parse(data);
                    res.json({
                        txtype: settings.txtype,
                        mobile_mode: settings.mobile_mode,
                        main_volume: settings.main_volume,
                        fm_volume: settings.fm_volume,
                        fm_auto: settings.fm_auto,
                        fm_threshold: settings.fm_threshold,
                        external_id: settings.external_id,
                        disabled: settings.disabled,
                        wifi_ssid: settings.wifi_ssid || '',
                        wifi_password: settings.wifi_password || '',
                        timestamp: new Date().toISOString()
                    });
                } catch (parseErr) {
                    res.status(500).json({ error: 'Failed to parse settings' });
                }
            });
        } catch (error: any) {
            res.status(500).json({ error: 'Failed to retrieve settings', message: error.message });
        }
    }

    public updateSettings(req: Request, res: Response): void {
        fs.readFile(this.settingsFilePath, 'utf8', (err, data) => {
            if (err) {
                res.status(500).json({ error: 'Failed to read settings' });
                return;
            }

            try {
                const currentSettings = JSON.parse(data);
                const newSettings = { ...currentSettings, ...req.body };

                // Check if WiFi settings are being updated
                const wifiUpdated = req.body.wifi_ssid && req.body.wifi_password;
                
                fs.writeFile(this.settingsFilePath, JSON.stringify(newSettings, null, 2), 'utf8', (writeErr) => {
                    if (writeErr) {
                        res.status(500).json({ error: 'Failed to update settings' });
                        return;
                    }
                    
                    // If WiFi settings updated, try to connect
                    if (wifiUpdated) {
                        try {
                            console.log(`Attempting to connect to WiFi: ${req.body.wifi_ssid}`);
                            const connected = connectToNetwork('wifi', req.body.wifi_ssid, req.body.wifi_password);
                            
                            if (connected) {
                                res.json({ 
                                    message: 'Settings updated successfully and connected to WiFi', 
                                    wifi_connected: true,
                                    timestamp: new Date().toISOString() 
                                });
                            } else {
                                res.json({ 
                                    message: 'Settings updated but failed to connect to WiFi', 
                                    wifi_connected: false,
                                    timestamp: new Date().toISOString() 
                                });
                            }
                        } catch (connectError) {
                            console.error('WiFi connection error:', connectError);
                            res.json({ 
                                message: 'Settings updated but WiFi connection failed', 
                                wifi_connected: false,
                                error: connectError instanceof Error ? connectError.message : 'Unknown error',
                                timestamp: new Date().toISOString() 
                            });
                        }
                    } else {
                        res.json({ 
                            message: 'Settings updated successfully', 
                            timestamp: new Date().toISOString() 
                        });
                    }
                });
            } catch (parseErr) {
                res.status(500).json({ error: 'Failed to parse settings' });
            }
        });
    }

    public getVolume(req: Request, res: Response): void {
        fs.readFile(this.settingsFilePath, 'utf8', (err, data) => {
            if (err) {
                res.status(500).json({ error: 'Failed to read settings' });
                return;
            }
            try {
                const settings = JSON.parse(data);
                res.json({
                    mainVolume: settings.main_volume,
                    fmVolume: settings.fm_volume,
                    timestamp: new Date().toISOString()
                });
            } catch (parseErr) {
                res.status(500).json({ error: 'Failed to parse settings' });
            }
        });
    }

    public setVolume(req: Request, res: Response): void {
        const { mainVolume, fmVolume } = req.body;
        
        fs.readFile(this.settingsFilePath, 'utf8', (err, data) => {
            if (err) {
                res.status(500).json({ error: 'Failed to read settings' });
                return;
            }

            try {
                const settings = JSON.parse(data);
                if (mainVolume !== undefined) settings.main_volume = mainVolume;
                if (fmVolume !== undefined) settings.fm_volume = fmVolume;

                fs.writeFile(this.settingsFilePath, JSON.stringify(settings, null, 2), 'utf8', (writeErr) => {
                    if (writeErr) {
                        res.status(500).json({ error: 'Failed to update volume' });
                        return;
                    }
                    res.json({ message: 'Volume updated successfully', timestamp: new Date().toISOString() });
                });
            } catch (parseErr) {
                res.status(500).json({ error: 'Failed to parse settings' });
            }
        });
    }
}

export default new SettingsController();