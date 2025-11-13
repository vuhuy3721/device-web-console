import { Request, Response } from 'express';
import { mgwDataService } from '../services/mgwDataService';
import { MGWStatus } from '../../types/mgw';

/**
 * MGW Controller
 * Handles incoming status updates from MGW software
 */
export class MGWController {
  
  /**
   * POST /api/mgw/status
   * Receive status update from MGW (called periodically by MGW software)
   */
  public receiveStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const status: MGWStatus = req.body;

      // Validate and store status
      mgwDataService.receiveStatus(status);

      res.json({
        success: true,
        message: 'Status received',
        timestamp: Date.now()
      });

    } catch (error: any) {
      console.error('Failed to receive MGW status:', error);
      res.status(400).json({
        success: false,
        message: 'Invalid status data',
        error: error.message
      });
    }
  };

  /**
   * GET /api/mgw/status
   * Get current MGW status (for Web Console UI)
   */
  public getStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const formatted = mgwDataService.getFormattedStatus();
      
      res.json({
        success: true,
        ...formatted
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to get MGW status',
        error: error.message
      });
    }
  };

  /**
   * GET /api/mgw/raw
   * Get raw current status
   */
  public getRawStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const status = mgwDataService.getCurrentStatus();
      
      if (!status) {
        res.status(404).json({
          success: false,
          message: 'No data available'
        });
        return;
      }

      res.json({
        success: true,
        status
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to get raw status',
        error: error.message
      });
    }
  };

  /**
   * GET /api/mgw/history
   * Get status history
   */
  public getHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const history = mgwDataService.getHistory(limit);

      res.json({
        success: true,
        count: history.length,
        history
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to get history',
        error: error.message
      });
    }
  };

  /**
   * GET /api/mgw/health
   * Get health metrics
   */
  public getHealth = async (req: Request, res: Response): Promise<void> => {
    try {
      const metrics = mgwDataService.getHealthMetrics();

      res.json({
        success: true,
        metrics
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to get health metrics',
        error: error.message
      });
    }
  };

  /**
   * DELETE /api/mgw/data
   * Clear all MGW data
   */
  public clearData = async (req: Request, res: Response): Promise<void> => {
    try {
      mgwDataService.clearData();

      res.json({
        success: true,
        message: 'All MGW data cleared'
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to clear data',
        error: error.message
      });
    }
  };
}
