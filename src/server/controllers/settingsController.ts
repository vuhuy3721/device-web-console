import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

export class SettingsController {
    private settingsFilePath: string;

    constructor() {
        this.settingsFilePath = path.join(__dirname, '../config/settings.json');
    }

    public getSettings(req: Request, res: Response): void {
        fs.readFile(this.settingsFilePath, 'utf8', (err, data) => {
            if (err) {
                res.status(500).json({ error: 'Failed to read settings' });
                return;
            }
            try {
                const settings = JSON.parse(data);
                res.json({
                    bootstrap_enabled: settings.bootstrap_enabled,
                    mqtt_server: settings.bootstrap_mqtt_defaults?.mqtt_server,
                    mqtt_port: settings.bootstrap_mqtt_defaults?.mqtt_port,
                    mqtt_security: settings.bootstrap_mqtt_defaults?.mqtt_security,
                    mobile_mode: settings.mobile_mode,
                    main_volume: settings.main_volume,
                    fm_volume: settings.fm_volume,
                    external_id: settings.external_id,
                    disabled: settings.disabled,
                    timestamp: new Date().toISOString()
                });
            } catch (parseErr) {
                res.status(500).json({ error: 'Failed to parse settings' });
            }
        });
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

                fs.writeFile(this.settingsFilePath, JSON.stringify(newSettings, null, 2), 'utf8', (writeErr) => {
                    if (writeErr) {
                        res.status(500).json({ error: 'Failed to update settings' });
                        return;
                    }
                    res.json({ message: 'Settings updated successfully', timestamp: new Date().toISOString() });
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