import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

export class AdminController {
    private settingsFilePath: string;

    constructor() {
        this.settingsFilePath = path.join(__dirname, '../config/settings.json');
    }

    public setPassword(req: Request, res: Response): void {
        const { newPassword } = req.body;
        if (!newPassword) {
            res.status(400).json({ message: 'New password is required.' });
            return;
        }

        try {
            const settings = JSON.parse(fs.readFileSync(this.settingsFilePath, 'utf8'));
            settings.admin = settings.admin || {};
            settings.admin.password = newPassword;
            fs.writeFileSync(this.settingsFilePath, JSON.stringify(settings, null, 2));
            res.status(200).json({ message: 'Password updated successfully.', timestamp: new Date().toISOString() });
        } catch (error: any) {
            res.status(500).json({ message: 'Failed to update password.', error: error.message });
        }
    }

    public getPassword(req: Request, res: Response): void {
        try {
            const settings = JSON.parse(fs.readFileSync(this.settingsFilePath, 'utf8'));
            const password = settings.admin?.password || 'not_set';
            res.status(200).json({ 
                password: password === 'not_set' ? null : '***' ,
                isSet: password !== 'not_set',
                timestamp: new Date().toISOString()
            });
        } catch (error: any) {
            res.status(500).json({ message: 'Failed to retrieve password status.', error: error.message });
        }
    }

    public checkPassword(req: Request, res: Response): void {
        const { password } = req.body;
        if (!password) {
            res.status(400).json({ message: 'Password is required.' });
            return;
        }

        try {
            const settings = JSON.parse(fs.readFileSync(this.settingsFilePath, 'utf8'));
            const correctPassword = settings.admin?.password || 'default_password';
            
            if (password === correctPassword) {
                res.status(200).json({ message: 'Access granted.', timestamp: new Date().toISOString() });
            } else {
                res.status(403).json({ message: 'Access denied. Invalid password.' });
            }
        } catch (error: any) {
            res.status(500).json({ message: 'Failed to check password.', error: error.message });
        }
    }

    public getSettings(req: Request, res: Response): void {
        try {
            const settings = JSON.parse(fs.readFileSync(this.settingsFilePath, 'utf8'));
            const adminSettings = {
                passwordSet: !!settings.admin?.password,
                bootstrapEnabled: settings.bootstrap_enabled,
                externalId: settings.external_id,
                deviceStatus: settings.disabled === 0 ? 'Enabled' : 'Disabled',
                mobileMode: settings.mobile_mode === 3 ? '4G/LTE' : '3G',
                lastModified: new Date().toISOString()
            };
            res.json(adminSettings);
        } catch (error: any) {
            res.status(500).json({ error: 'Failed to retrieve admin settings', message: error.message });
        }
    }

    public updatePassword(req: Request, res: Response): void {
        this.setPassword(req, res);
    }

    public getStatus(req: Request, res: Response): void {
        try {
            const settings = JSON.parse(fs.readFileSync(this.settingsFilePath, 'utf8'));
            const status = {
                adminPanel: 'Active',
                deviceStatus: settings.disabled === 0 ? 'Online' : 'Offline',
                lastAccess: new Date().toISOString(),
                uptime: process.uptime(),
                version: '1.0.0'
            };
            res.json(status);
        } catch (error: any) {
            res.status(500).json({ error: 'Failed to retrieve admin status', message: error.message });
        }
    }

    public rebootDevice(req: Request, res: Response): void {
        // Simulated reboot response
        res.json({ 
            message: 'Device rebooting...',
            timestamp: new Date().toISOString(),
            estimatedTime: '30 seconds'
        });
    }

    public factoryReset(req: Request, res: Response): void {
        // Simulated factory reset response (dangerous operation)
        res.status(400).json({ 
            message: 'Factory reset requires additional confirmation.',
            error: 'Missing confirmation flag'
        });
    }
}

export default new AdminController();