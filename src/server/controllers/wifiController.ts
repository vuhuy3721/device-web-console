import { Request, Response } from 'express';
import { connectToNetwork } from '../utils/networkUtils';
import * as fs from 'fs';
import * as path from 'path';

export class WifiController {
    private settingsFilePath: string;

    constructor() {
        this.settingsFilePath = path.join(__dirname, '../config/settings.json');
    }

    /**
     * Test WiFi connection without saving
     */
    public testWifiConnection(req: Request, res: Response): void {
        const { ssid, password } = req.body;

        if (!ssid || !password) {
            res.status(400).json({ 
                error: 'SSID and password are required',
                wifi_connected: false
            });
            return;
        }

        try {
            console.log(`Testing WiFi connection to: ${ssid}`);
            const connected = connectToNetwork('wifi', ssid, password);

            if (connected) {
                res.json({
                    message: 'Successfully connected to WiFi',
                    wifi_connected: true,
                    ssid: ssid,
                    timestamp: new Date().toISOString()
                });
            } else {
                res.json({
                    message: 'Failed to connect to WiFi',
                    wifi_connected: false,
                    ssid: ssid,
                    timestamp: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('WiFi connection error:', error);
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Unknown error',
                wifi_connected: false,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Connect to WiFi and save settings
     */
    public connectAndSave(req: Request, res: Response): void {
        const { ssid, password } = req.body;

        if (!ssid || !password) {
            res.status(400).json({ 
                error: 'SSID and password are required',
                wifi_connected: false
            });
            return;
        }

        try {
            // First try to connect
            console.log(`Connecting to WiFi: ${ssid}`);
            const connected = connectToNetwork('wifi', ssid, password);

            if (connected) {
                // If connected, save to settings
                fs.readFile(this.settingsFilePath, 'utf8', (err, data) => {
                    if (err) {
                        res.status(500).json({ 
                            error: 'Connected but failed to save settings',
                            wifi_connected: true
                        });
                        return;
                    }

                    try {
                        const settings = JSON.parse(data);
                        settings.wifi_ssid = ssid;
                        settings.wifi_password = password;

                        fs.writeFile(this.settingsFilePath, JSON.stringify(settings, null, 2), 'utf8', (writeErr) => {
                            if (writeErr) {
                                res.status(500).json({ 
                                    error: 'Connected but failed to save settings',
                                    wifi_connected: true
                                });
                                return;
                            }

                            res.json({
                                message: 'Connected to WiFi and settings saved',
                                wifi_connected: true,
                                ssid: ssid,
                                timestamp: new Date().toISOString()
                            });
                        });
                    } catch (parseErr) {
                        res.status(500).json({ 
                            error: 'Connected but failed to parse settings',
                            wifi_connected: true
                        });
                    }
                });
            } else {
                res.json({
                    message: 'Failed to connect to WiFi',
                    wifi_connected: false,
                    ssid: ssid,
                    timestamp: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('WiFi connection error:', error);
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Unknown error',
                wifi_connected: false,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Disconnect from WiFi
     */
    public disconnectWifi(req: Request, res: Response): void {
        try {
            // Use nmcli to disconnect
            const { execSync } = require('child_process');
            execSync('nmcli device disconnect wlan0', { stdio: 'pipe' });

            res.json({
                message: 'Disconnected from WiFi',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('WiFi disconnect error:', error);
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Failed to disconnect',
                timestamp: new Date().toISOString()
            });
        }
    }
}
