import { Request, Response } from 'express';
import { storage } from '../services/storageService';

/**
 * Admin Controller - Manages admin panel, password management, and device status
 * Uses StorageService for settings file I/O
 */
export class AdminController {
    /**
     * Set or update admin password
     */
    public async setPassword(req: Request, res: Response): Promise<void> {
        const { newPassword } = req.body;
        
        if (!newPassword) {
            res.status(400).json({ message: 'New password is required.' });
            return;
        }

        try {
            const settings = await storage.getSettings();
            
            if (!settings) {
                res.status(500).json({ message: 'Failed to load settings.' });
                return;
            }

            settings.admin = settings.admin || {};
            settings.admin.password = newPassword;
            
            const saved = await storage.saveSettings(settings);

            if (!saved) {
                res.status(500).json({ message: 'Failed to save password.' });
                return;
            }

            res.status(200).json({ 
                message: 'Password updated successfully.',
                timestamp: new Date().toISOString()
            });
        } catch (error: any) {
            console.error('Set password error:', error);
            res.status(500).json({ 
                message: 'Failed to update password.', 
                error: error.message 
            });
        }
    }

    /**
     * Get current password status
     */
    public async getPassword(req: Request, res: Response): Promise<void> {
        try {
            const settings = await storage.getSettings();
            
            if (!settings) {
                res.status(500).json({ message: 'Failed to load settings.' });
                return;
            }

            const password = settings.admin?.password || 'not_set';
            
            res.status(200).json({ 
                password: password,
                isSet: password !== 'not_set',
                timestamp: new Date().toISOString()
            });
        } catch (error: any) {
            console.error('Get password error:', error);
            res.status(500).json({ 
                message: 'Failed to retrieve password status.', 
                error: error.message 
            });
        }
    }

    /**
     * Verify admin password
     */
    public async checkPassword(req: Request, res: Response): Promise<void> {
        const { password } = req.body;
        
        if (!password) {
            res.status(400).json({ message: 'Password is required.' });
            return;
        }

        try {
            const settings = await storage.getSettings();
            
            if (!settings) {
                res.status(500).json({ message: 'Failed to load settings.' });
                return;
            }

            const correctPassword = settings.admin?.password || 'default_password';
            
            if (password === correctPassword) {
                res.status(200).json({ 
                    message: 'Access granted.',
                    timestamp: new Date().toISOString()
                });
            } else {
                res.status(403).json({ message: 'Access denied. Invalid password.' });
            }
        } catch (error: any) {
            console.error('Check password error:', error);
            res.status(500).json({ 
                message: 'Failed to check password.', 
                error: error.message 
            });
        }
    }

    /**
     * Login and get access token
     */
    public async login(req: Request, res: Response): Promise<void> {
        const { password } = req.body;
        
        if (!password) {
            res.status(400).json({ message: 'Password is required.' });
            return;
        }

        try {
            const settings = await storage.getSettings();
            
            if (!settings) {
                res.status(500).json({ message: 'Failed to load settings.' });
                return;
            }

            const correctPassword = settings.admin?.password || 'admin';
            
            if (password === correctPassword) {
                res.status(200).json({ 
                    message: 'Login successful.',
                    token: process.env.AUTH_TOKEN || 'dev_token_12345',
                    username: 'admin'
                });
            } else {
                res.status(401).json({ message: 'Invalid password.' });
            }
        } catch (error: any) {
            console.error('Login error:', error);
            res.status(500).json({ 
                message: 'Login failed.', 
                error: error.message 
            });
        }
    }

    /**
     * Get admin settings overview
     */
    public async getSettings(req: Request, res: Response): Promise<void> {
        try {
            const settings = await storage.getSettings();
            
            if (!settings) {
                res.status(500).json({ error: 'Failed to load settings' });
                return;
            }

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
            console.error('Get admin settings error:', error);
            res.status(500).json({ 
                error: 'Failed to retrieve admin settings', 
                message: error.message 
            });
        }
    }

    /**
     * Alias for setPassword (for compatibility)
     */
    public updatePassword(req: Request, res: Response): void {
        this.setPassword(req, res);
    }

    /**
     * Change password with current password verification
     */
    public async changePassword(req: Request, res: Response): Promise<void> {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            res.status(400).json({ error: 'Current password and new password are required' });
            return;
        }

        if (newPassword.length < 6) {
            res.status(400).json({ error: 'New password must be at least 6 characters long' });
            return;
        }

        try {
            const settings = await storage.getSettings();
            
            if (!settings) {
                res.status(500).json({ error: 'Failed to load settings' });
                return;
            }

            const storedPassword = settings.admin?.password || 'admin';
            
            // Verify current password
            if (currentPassword !== storedPassword) {
                res.status(403).json({ error: 'Current password is incorrect' });
                return;
            }

            // Update to new password
            settings.admin = settings.admin || {};
            settings.admin.password = newPassword;
            
            const saved = await storage.saveSettings(settings);

            if (!saved) {
                res.status(500).json({ error: 'Failed to save new password' });
                return;
            }
            
            console.log('Password changed successfully');
            res.status(200).json({ 
                message: 'Password changed successfully',
                timestamp: new Date().toISOString()
            });
        } catch (error: any) {
            console.error('Error changing password:', error);
            res.status(500).json({ 
                error: 'Failed to change password',
                message: error.message 
            });
        }
    }

    /**
     * Get admin panel status
     */
    public async getStatus(req: Request, res: Response): Promise<void> {
        try {
            const settings = await storage.getSettings();
            
            if (!settings) {
                res.status(500).json({ error: 'Failed to load settings' });
                return;
            }

            const status = {
                adminPanel: 'Active',
                deviceStatus: settings.disabled === 0 ? 'Online' : 'Offline',
                lastAccess: new Date().toISOString(),
                uptime: process.uptime(),
                version: '1.0.0'
            };

            res.json(status);
        } catch (error: any) {
            console.error('Get admin status error:', error);
            res.status(500).json({ 
                error: 'Failed to retrieve admin status', 
                message: error.message 
            });
        }
    }

    /**
     * Trigger device reboot
     * Note: Actual reboot is handled by /api/reboot endpoint in index.ts
     */
    public rebootDevice(req: Request, res: Response): void {
        res.json({ 
            message: 'Device rebooting...',
            timestamp: new Date().toISOString(),
            estimatedTime: '30 seconds'
        });
    }

    /**
     * Factory reset (requires confirmation)
     */
    public factoryReset(req: Request, res: Response): void {
        res.status(400).json({ 
            message: 'Factory reset requires additional confirmation.',
            error: 'Missing confirmation flag'
        });
    }
}

export default new AdminController();
