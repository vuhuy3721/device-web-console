import { Request, Response } from 'express';
import { storage } from '../services/storageService';
import { getIpAddress, getSubnetMask, getGateway, getDnsServers, getMacAddress, getSignalStrength } from '../utils/networkUtils';

/**
 * Connection Controller - Manages device connection information and settings
 * Uses StorageService for settings file I/O
 */
export class ConnectionController {
    /**
     * Get comprehensive connection information
     * Combines settings from storage with real-time network data
     */
    public async getConnectionInfo(req: Request, res: Response): Promise<void> {
        try {
            const settings = await storage.getSettings();
            
            if (!settings) {
                res.status(500).json({ error: 'Failed to load settings' });
                return;
            }

            // Get real-time network info from system
            const ipAddress = getIpAddress() || '192.168.1.100';
            const subnetMask = getSubnetMask() || '255.255.255.0';
            const gateway = getGateway() || '192.168.1.1';
            const dnsServers = getDnsServers() || ['8.8.8.8', '8.8.4.4'];
            const macAddress = getMacAddress() || 'N/A';
            const signalStrength = getSignalStrength();

            const connectionInfo = {
                // Static info from settings
                deviceId: settings.external_id,
                verifyCode: settings.external_key,
                firmwareVersion: settings.firmware_version || 'V4-3.0.5p5',
                
                // Connection status
                status: settings.disabled === 0 ? 'Connected' : 'Disconnected',
                
                // Network info
                networkType: settings.mobile_mode === 3 ? '3G' : '4G/LTE',
                signalStrength: signalStrength,
                
                // LAN settings
                ipAddress: ipAddress,
                subnet: subnetMask,
                gateway: gateway,
                macAddress: macAddress,
                dnsServers: dnsServers,
                
                // MQTT settings
                mqttServer: settings.bootstrap_mqtt_defaults?.mqtt_server || 'aiot.mobifone.vn',
                mqttPort: settings.bootstrap_mqtt_defaults?.mqtt_port || 6668,
                mqttSecurity: settings.bootstrap_mqtt_defaults?.mqtt_security || 1,
                
                // Bootstrap info
                bootstrapServer: settings.bootstrap_server || 'https://aiot.mobifone.vn',
                
                timestamp: new Date().toISOString()
            };

            res.json(connectionInfo);
        } catch (error: any) {
            console.error('Get connection info error:', error);
            res.status(500).json({ 
                error: 'Failed to retrieve connection info', 
                message: error.message 
            });
        }
    }

    /**
     * Disconnect device - set disabled flag to 1
     */
    public async disconnect(req: Request, res: Response): Promise<void> {
        try {
            const settings = await storage.getSettings();
            
            if (!settings) {
                res.status(500).json({ error: 'Failed to load settings' });
                return;
            }

            settings.disabled = 1;
            const saved = await storage.saveSettings(settings);

            if (!saved) {
                res.status(500).json({ error: 'Failed to save settings' });
                return;
            }

            res.json({ 
                message: 'Disconnected successfully', 
                timestamp: new Date().toISOString() 
            });
        } catch (error: any) {
            console.error('Disconnect error:', error);
            res.status(500).json({ 
                error: 'Failed to disconnect', 
                message: error.message 
            });
        }
    }

    /**
     * Connect device - set disabled flag to 0
     */
    public async connect(req: Request, res: Response): Promise<void> {
        try {
            const settings = await storage.getSettings();
            
            if (!settings) {
                res.status(500).json({ error: 'Failed to load settings' });
                return;
            }

            settings.disabled = 0;
            const saved = await storage.saveSettings(settings);

            if (!saved) {
                res.status(500).json({ error: 'Failed to save settings' });
                return;
            }

            res.json({ 
                message: 'Connected successfully', 
                timestamp: new Date().toISOString() 
            });
        } catch (error: any) {
            console.error('Connect error:', error);
            res.status(500).json({ 
                error: 'Failed to connect', 
                message: error.message 
            });
        }
    }

    /**
     * Update connection settings (MQTT, mobile mode)
     */
    public async updateConnectionSettings(req: Request, res: Response): Promise<void> {
        try {
            const settings = await storage.getSettings();
            
            if (!settings) {
                res.status(500).json({ error: 'Failed to load settings' });
                return;
            }

            const { mqttServer, mqttPort, mobileMode } = req.body;
            
            // Update MQTT settings if provided
            if (mqttServer) {
                if (!settings.bootstrap_mqtt_defaults) {
                    settings.bootstrap_mqtt_defaults = {};
                }
                settings.bootstrap_mqtt_defaults.mqtt_server = mqttServer;
            }
            
            if (mqttPort) {
                if (!settings.bootstrap_mqtt_defaults) {
                    settings.bootstrap_mqtt_defaults = {};
                }
                settings.bootstrap_mqtt_defaults.mqtt_port = mqttPort;
            }
            
            // Update mobile mode if provided
            if (mobileMode !== undefined) {
                settings.mobile_mode = mobileMode;
            }
            
            const saved = await storage.saveSettings(settings);

            if (!saved) {
                res.status(500).json({ error: 'Failed to save settings' });
                return;
            }

            res.json({ 
                message: 'Connection settings updated', 
                timestamp: new Date().toISOString() 
            });
        } catch (error: any) {
            console.error('Update connection settings error:', error);
            res.status(500).json({ 
                error: 'Failed to update settings', 
                message: error.message 
            });
        }
    }
}

export default new ConnectionController();
