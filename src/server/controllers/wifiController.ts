import { Request, Response } from 'express';
import { storage } from '../services/storageService';
import { connectToNetwork } from '../utils/networkUtils';

/**
 * WiFi Controller - Manages WiFi connection and configuration
 * Uses StorageService for settings and networkUtils for actual WiFi operations
 */
export class WifiController {
    /**
     * Test WiFi connection without saving credentials
     * Attempts to connect to the specified SSID
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
     * Connect to WiFi and save credentials to settings
     * First attempts connection, then saves if successful
     */
    public async connectAndSave(req: Request, res: Response): Promise<void> {
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
                const settings = await storage.getSettings();
                
                if (!settings) {
                    res.status(500).json({ 
                        error: 'Connected but failed to load settings',
                        wifi_connected: true
                    });
                    return;
                }

                settings.wifi_ssid = ssid;
                settings.wifi_password = password;

                const saved = await storage.saveSettings(settings);

                if (!saved) {
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
     * Disconnect from current WiFi network
     * Uses nmcli to disconnect wlan0 interface
     */
    public disconnectWifi(req: Request, res: Response): void {
        try {
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

export default new WifiController();
