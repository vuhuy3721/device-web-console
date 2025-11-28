import { Request, Response } from 'express';
import { externalApi } from '../services/externalApiService';
import { storage } from '../services/storageService';
import { connectToNetwork } from '../utils/networkUtils';

/**
 * Settings Controller
 * Manages device settings with external API sync and WiFi configuration
 */
export class SettingsController {

  /**
   * GET /api/settings
   * Get device settings (merged from external API and local storage)
   */
  public getSettings = async (req: Request, res: Response): Promise<void> => {
    try {
      // Read local settings first
      const localSettings = storage.getSettings();

      if (!localSettings) {
        res.status(500).json({ error: 'Failed to read local settings' });
        return;
      }

      // Try to fetch from external API
      const externalResponse = await externalApi.getSettings();

      if (externalResponse && externalResponse.success && externalResponse.data) {
        // Merge external data with local settings (preserve local-only fields)
        const mergedSettings = { ...localSettings, ...externalResponse.data };

        // Save merged data
        storage.saveSettings(mergedSettings);

        // Return merged data with WiFi fields
        res.json({
          ...mergedSettings,
          wifi_ssid: mergedSettings.wifi_ssid || '',
          wifi_password: mergedSettings.wifi_password || '',
          timestamp: new Date().toISOString()
        });
        return;
      }

      // Fallback to local data
      res.json({
        ...localSettings,
        wifi_ssid: localSettings.wifi_ssid || '',
        wifi_password: localSettings.wifi_password || '',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Error in getSettings:', error);
      res.status(500).json({ error: 'Failed to retrieve settings', message: error.message });
    }
  }

  /**
   * PUT /api/settings
   * Update device settings and optionally connect to WiFi
   */
  public updateSettings(req: Request, res: Response): void {
    const currentSettings = storage.getSettings();

    if (!currentSettings) {
      res.status(500).json({ error: 'Failed to read current settings' });
      return;
    }

    // Merge new settings with current
    const newSettings = { ...currentSettings, ...req.body };

    // Check if WiFi settings are being updated
    const wifiUpdated = req.body.wifi_ssid && req.body.wifi_password;

    // Save to storage
    if (!storage.saveSettings(newSettings)) {
      res.status(500).json({ error: 'Failed to save settings' });
      return;
    }

    // If WiFi updated, attempt to connect
    if (wifiUpdated) {
      try {
        const connected = connectToNetwork('wifi', req.body.wifi_ssid, req.body.wifi_password);
        res.json({
          message: connected ? 'Settings updated and WiFi connected successfully!' : 'Settings saved but WiFi connection failed',
          wifi_connected: connected
        });
      } catch (error: any) {
        res.json({
          message: 'Settings saved but WiFi connection failed',
          wifi_connected: false,
          error: error.message
        });
      }
      return;
    }

    // No WiFi update
    res.json({ message: 'Settings updated successfully!' });
  }
}

export default new SettingsController();
