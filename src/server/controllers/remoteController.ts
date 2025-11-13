import { Request, Response } from 'express';
import { RemoteManagementService } from '../services/remoteManagementService';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Remote Management Controller
 * Provides HTTP API for device management (independent of MQTT)
 */
export class RemoteController {
  private remoteService: RemoteManagementService;
  private settingsFilePath: string;

  constructor() {
    this.settingsFilePath = path.join(__dirname, '../config/settings.json');
    
    // Load device ID from settings
    const settings = JSON.parse(fs.readFileSync(this.settingsFilePath, 'utf-8'));
    const deviceId = settings.external_id || 'unknown-device';
    
    this.remoteService = new RemoteManagementService(deviceId, this.settingsFilePath);
    
    // Initialize MQTT (non-blocking - will work in background)
    this.remoteService.initializeMQTT();
  }

  /**
   * GET /api/remote/status
   * Get device status including MQTT connection state
   */
  public getStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const status = this.remoteService.executeCommand({
        type: 'get_status',
        payload: {},
        timestamp: Date.now(),
        source: 'http'
      });

      res.json({
        success: true,
        ...status
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to get device status',
        error: error.message
      });
    }
  };

  /**
   * POST /api/remote/config
   * Update device configuration (including MQTT settings)
   */
  public updateConfig = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = this.remoteService.executeCommand({
        type: 'set_config',
        payload: req.body,
        timestamp: Date.now(),
        source: 'http'
      });

      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update configuration',
        error: error.message
      });
    }
  };

  /**
   * POST /api/remote/mqtt/config
   * Update MQTT configuration and reconnect
   */
  public updateMQTTConfig = async (req: Request, res: Response): Promise<void> => {
    try {
      const { server, port, username, password } = req.body;

      if (!server || !port) {
        res.status(400).json({
          success: false,
          message: 'Server and port are required'
        });
        return;
      }

      this.remoteService.updateMQTTConfig(server, port, username, password);

      res.json({
        success: true,
        message: 'MQTT configuration updated, reconnecting...'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update MQTT configuration',
        error: error.message
      });
    }
  };

  /**
   * GET /api/remote/mqtt/status
   * Get MQTT connection status
   */
  public getMQTTStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const status = this.remoteService.getMQTTStatus();
      
      res.json({
        success: true,
        ...status
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to get MQTT status',
        error: error.message
      });
    }
  };

  /**
   * POST /api/remote/reboot
   * Reboot device with optional delay
   */
  public reboot = async (req: Request, res: Response): Promise<void> => {
    try {
      const delay = req.body.delay || 5;

      const result = this.remoteService.executeCommand({
        type: 'reboot',
        payload: { delay },
        timestamp: Date.now(),
        source: 'http'
      });

      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to reboot device',
        error: error.message
      });
    }
  };

  /**
   * POST /api/remote/mqtt/reconnect
   * Force MQTT reconnection
   */
  public reconnectMQTT = async (req: Request, res: Response): Promise<void> => {
    try {
      this.remoteService.reconnectMQTT();
      
      res.json({
        success: true,
        message: 'MQTT reconnection initiated'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to reconnect MQTT',
        error: error.message
      });
    }
  };

  /**
   * Get remote management service instance
   */
  public getService(): RemoteManagementService {
    return this.remoteService;
  }
}
