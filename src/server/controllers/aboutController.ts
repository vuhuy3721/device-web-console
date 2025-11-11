import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

export class AboutController {
    public getAboutInfo(req: Request, res: Response): void {
        try {
            const settingsPath = path.join(__dirname, '../config/settings.json');
            const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
            
            const aboutInfo = {
                name: "Device Web Console",
                version: "1.0.0",
                description: "A comprehensive web console for device management and monitoring with support for 3G/4G networks, MQTT connectivity, and real-time status updates.",
                author: "Device Management Team",
                license: "MIT",
                contact: "support@example.com",
                website: "https://example.com",
                features: [
                    "Real-time device status monitoring",
                    "Connection management",
                    "Network configuration",
                    "Media playback control",
                    "Settings management",
                    "Admin control panel",
                    "MQTT integration",
                    "3G/4G network support"
                ],
                buildDate: new Date().toISOString(),
                deviceId: settings.external_id,
                bootstrapServer: settings.bootstrap_server,
                supportedNetworks: [
                    "3G",
                    "4G/LTE",
                    "WiFi"
                ],
                technology: {
                    frontend: "HTML5, CSS3, JavaScript",
                    backend: "TypeScript, Express.js, Node.js",
                    database: "JSON file storage",
                    communication: "REST API, MQTT"
                },
                timestamp: new Date().toISOString()
            };
            res.json(aboutInfo);
        } catch (error: any) {
            res.status(500).json({ error: 'Failed to retrieve about info', message: error.message });
        }
    }
}

export default new AboutController();