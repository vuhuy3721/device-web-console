import { Request, Response } from 'express';
import { externalApi } from '../services/externalApiService';
import { storage } from '../services/storageService';

/**
 * About Controller
 * Provides device information
 */
export class AboutController {

  /**
   * GET /api/about
   * Get device information (from external API with local fallback)
   */
  public getAboutInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      // Get settings for device ID and vcode
      const settings = storage.getSettings();

      // Try external API
      const externalResponse = await externalApi.getInfo();

      if (externalResponse && externalResponse.success && externalResponse.data) {
        const aboutInfo = {
          ...externalResponse.data,
          id: settings?.external_id || 'Unknown',
          vcode: settings?.external_key || 'V12345',
          timestamp: new Date().toISOString()
        };

        storage.saveInfo(aboutInfo);
        res.json(aboutInfo);
        return;
      }

      // Fallback info
      const fallbackInfo = {
        device: {
          id: settings?.external_id || 'Unknown',
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

      res.json(fallbackInfo);
    } catch (error: any) {
      console.error('Error in getAboutInfo:', error);
      res.status(500).json({ error: 'Failed to retrieve about info', message: error.message });
    }
  }
}

export default new AboutController();
