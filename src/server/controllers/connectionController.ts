import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { getIpAddress, getSubnetMask, getGateway, getDnsServers, getMacAddress, getNetworkType, getSignalStrength } from '../utils/networkUtils';




export class ConnectionController {


    public getConnectionInfo(req: Request, res: Response): void {
        try {
            const settingsPath = path.join(__dirname, '../config/settings.json');
            const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

            // Get network info from system
            const ipAddress = getIpAddress() || '192.168.1.100';
            const subnetMask = getSubnetMask() || '255.255.255.0';
            const gateway = getGateway() || '192.168.1.1';
            const dnsServers = getDnsServers() || [];
            const macAddress = getMacAddress() || 'N/A';
            const networkType = getNetworkType();
            const signalStrength = getSignalStrength();

            const connectionInfo = {
                // Static info from settings.json
                deviceId: settings.external_id,
                verifyCode: settings.external_key,
                firmwareVersion: settings.firmware_version || 'V4-3.0.5p5',
                
                // Connection status
                status: settings.disabled === 0 ? 'Connected' : 'Disconnected',
                
                // Network info from system
                networkType: settings.mobile_mode === 3 ? '3G' : '4G/LTE',
                signalStrength: signalStrength,
                
                // LAN settings
                ipAddress: ipAddress,
                subnet: subnetMask,
                gateway: gateway,
                macAddress: macAddress,
                dnsServers: dnsServers.length > 0 ? dnsServers : ['8.8.8.8', '8.8.4.4'],
                
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
            res.status(500).json({ error: 'Failed to retrieve connection info', message: error.message });
        }
    }

    public disconnect(req: Request, res: Response): void {
        try {
            const settingsPath = path.join(__dirname, '../config/settings.json');
            const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
            settings.disabled = 1;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            res.json({ message: 'Disconnected successfully', timestamp: new Date().toISOString() });
        } catch (error: any) {
            res.status(500).json({ error: 'Failed to disconnect', message: error.message });
        }
    }

    public connect(req: Request, res: Response): void {
        try {
            const settingsPath = path.join(__dirname, '../config/settings.json');
            const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
            settings.disabled = 0;
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            res.json({ message: 'Connected successfully', timestamp: new Date().toISOString() });
        } catch (error: any) {
            res.status(500).json({ error: 'Failed to connect', message: error.message });
        }
    }

    public updateConnectionSettings(req: Request, res: Response): void {
        try {
            const settingsPath = path.join(__dirname, '../config/settings.json');
            const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
            
            const { mqttServer, mqttPort, mobileMode } = req.body;
            
            if (mqttServer) {
                settings.bootstrap_mqtt_defaults.mqtt_server = mqttServer;
            }
            if (mqttPort) {
                settings.bootstrap_mqtt_defaults.mqtt_port = mqttPort;
            }
            if (mobileMode !== undefined) {
                settings.mobile_mode = mobileMode;
            }
            
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            res.json({ message: 'Connection settings updated', timestamp: new Date().toISOString() });
        } catch (error: any) {
            res.status(500).json({ error: 'Failed to update settings', message: error.message });
        }
    }
}

export default new ConnectionController();