import e, { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

const EXTERNAL_API_URL = 'http://100.78.142.94:8080';

export class AboutController {
    private infoFilePath: string;

    constructor() {
        this.infoFilePath = path.join(__dirname, '../config/info.json');
    }

    private saveInfoToFile(data: any): void {
        try {
            fs.writeFileSync(this.infoFilePath, JSON.stringify(data, null, 2), 'utf8');
            console.log('Info saved to file:', this.infoFilePath);
        } catch (error) {
            console.error('Error saving info to file:', error);
        }
    }

    private async fetchExternalInfo(): Promise<any> {
        try {
            const response = await fetch(`${EXTERNAL_API_URL}/api/info`);
            if (!response.ok) {
                console.warn(`Failed to fetch external info: ${response.statusText}`);
                return null;
            }
            return await response.json();
        } catch (error) {
            console.warn('Error fetching from external API:', error);
            return null;
        }
    }

    public getAboutInfo = async (req: Request, res: Response): Promise<void> => {
        try {
            // Try to fetch from external API first
            const externalResponse = await this.fetchExternalInfo();
            
            // Fallback to local data
            const settingsPath = path.join(__dirname, '../config/settings.json');
            const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
            
            if (externalResponse && externalResponse.success && externalResponse.data) {
                // Response from external API has format: { success: true, data: {...}, timestamp: ... }
                const aboutInfo = {
                    ...externalResponse.data,
                    id: settings.external_id || 'Unknown',
                    vcode: settings.external_key || 'V12345',
                    timestamp: new Date().toISOString()
                };
                
                // Save to file
                this.saveInfoToFile(aboutInfo);
                
                res.json(aboutInfo);
                return;
            }
            const aboutInfo = {
                device: {
                    id: settings.external_id || 'Unknown',
                    vcode: 'V12345',
                    name: 'Device Name',
                    firmwareVersion: '1.0.0',
                    osVersion: 'Linux 5.4',
                    osBuild: '2024-01-01',
                    cpuProcessor: 'ARM Cortex-A53',
                    cpuFrequency: '1.4 GHz',
                    cpuCores: 4,
                    ram: '1 GB'
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