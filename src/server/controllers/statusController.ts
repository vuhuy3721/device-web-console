import { Request, Response } from 'express';
import { externalApi } from '../services/externalApiService';
import { storage } from '../services/storageService';
import { NETWORK_TYPES } from '../config/constants';

/**
 * Status Controller
 * Provides device status information
 */
export class StatusController {

  /**
   * GET /api/status
   * Get device status (from external API with local fallback)
   */
  public getStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      // Calculate uptime
      const uptime = process.uptime();
      const uptimeHours = Math.floor(uptime / 3600);
      const uptimeMinutes = Math.floor((uptime % 3600) / 60);

      // Get settings for network type
      const settings = storage.getSettings();
      const networkType = settings?.txtype === NETWORK_TYPES.FOUR_G ? '4G/LTE' : '3G';

      // Try external API
      const externalResponse = await externalApi.getStatus();

      if (externalResponse && externalResponse.success && externalResponse.data) {
        const status = {
          ...externalResponse.data,
          uptime: `${uptimeHours} hours ${uptimeMinutes} minutes`,
          storage: `Total: ${externalResponse.data.storage_total}MB, Free: ${externalResponse.data.storage_free}MB`,
          log: `Total: 1 GB, Free: 500 MB`,
          networkType,
          bootTime: new Date(Date.now() - uptime * 1000).toISOString(),
          fmStatus: 'Active',
          speakerStatus: 'Active',
          streamBack: "On",
          deviceTemperature: externalResponse.data.temperature ? `${externalResponse.data.temperature}°C` : '45°C',
          timestamp: new Date().toISOString()
        };

        storage.saveStatus(status);
        res.json(status);
        return;
      }

      // Fallback status
      const fallbackStatus = {
        uptime: `${uptimeHours} hours ${uptimeMinutes} minutes`,
        storage: `Total: 16 GB, Free: 8 GB`,
        log: `Total: 1 GB, Free: 500 MB`,
        networkType,
        bootTime: new Date(Date.now() - uptime * 1000).toISOString(),
        fmStatus: 'Active',
        speakerStatus: 'Active',
        streamBack: "On",
        deviceTemperature: '45°C',
        timestamp: new Date().toISOString()
      };

      storage.saveStatus(fallbackStatus);
      res.json(fallbackStatus);
    } catch (error: any) {
      console.error('Error in getStatus:', error);
      res.status(500).json({ error: 'Failed to retrieve status', message: error.message });
    }
  }
}

export default new StatusController();
