import { Request, Response } from 'express';
import { externalApi } from '../services/externalApiService';
import { storage } from '../services/storageService';
import { STATUS_MODES, REPEAT_TYPES } from '../config/constants';

/**
 * Media Controller
 * Manages media schedule operations
 */
export class MediaController {

  /**
   * GET /api/media
   * Get list of media schedules
   */
  public async getListMedia(req: Request, res: Response): Promise<void> {
    try {
      // Try external API first
      let schedulesData = await externalApi.getSchedules();

      // Fallback to local storage
      if (!schedulesData) {
        schedulesData = storage.getSchedules();
      }

      if (!schedulesData) {
        res.status(500).json({ error: 'Failed to fetch schedule from both external API and local storage' });
        return;
      }

      // Transform schedule data to media format
      const mediaFiles = Array.isArray(schedulesData) ? schedulesData.map(schedule => ({
        id: schedule.mid || 'Unknown',
        mid: schedule.mid,
        mode: schedule.mode === STATUS_MODES.SCHEDULE ? 'SCHEDULE' : 'NORMAL',
        priority: schedule.prio || 0,
        created: schedule.created ? new Date(schedule.created * 1000).toLocaleString('en-GB') : '',
        expired: schedule.expired ? new Date(schedule.expired * 1000).toLocaleString('en-GB') : '',
        start: schedule.start ? new Date(schedule.start * 1000).toLocaleString('en-GB') : '',
        repeatType: schedule.repeat === REPEAT_TYPES.MONTH_DAYS ? 'MONTH DAYS' : 'WEEK DAYS',
        activeDays: this.formatDays(schedule.days),
        scheduleTimes: this.formatTimes(schedule.ts),
        scheduleDurations: this.formatDurations(schedule.ds),
        filesInfo: schedule.files ? JSON.stringify(schedule.files[0] || {}) : '',
        status: 'NORMAL'
      })) : [];

      res.json({
        mediaFiles: mediaFiles,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error in getListMedia:', error);
      res.status(500).json({ error: 'Failed to retrieve media list' });
    }
  }

  /**
   * POST /api/media/play
   * Play a media file
   */
  public async playMedia(req: Request, res: Response): Promise<void> {
    const { mediaId } = req.body;

    if (!mediaId) {
      res.status(400).json({ error: 'mediaId is required' });
      return;
    }

    // TODO: Implement play media logic with external API
    res.json({ message: 'Media is now playing.', mediaId });
  }

  /**
   * POST /api/media/pause
   * Pause media playback
   */
  public pauseMedia(req: Request, res: Response): void {
    // TODO: Implement pause media logic
    res.json({ message: 'Media is paused.' });
  }

  /**
   * POST /api/media/stop
   * Stop media playback
   */
  public stopMedia(req: Request, res: Response): void {
    // TODO: Implement stop media logic
    res.json({ message: 'Media has been stopped.' });
  }

  /**
   * DELETE /api/media/delete
   * Delete a media schedule
   */
  public async deleteMedia(req: Request, res: Response): Promise<void> {
    try {
      const { mediaId } = req.body;

      if (!mediaId) {
        res.status(400).json({ error: 'mediaId is required' });
        return;
      }

      // Delete from external API
      const result = await externalApi.deleteSchedule(mediaId);

      res.json({
        success: true,
        message: `Media ${mediaId} deleted successfully`,
        data: result
      });
    } catch (error) {
      console.error('Error deleting media:', error);
      res.status(500).json({
        error: 'Failed to delete media',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Format days bitmask to comma-separated day numbers
   */
  private formatDays(days: number): string {
    if (!days) return '';

    const dayList: number[] = [];
    for (let i = 1; i <= 31; i++) {
      if (days & (1 << (i - 1))) {
        dayList.push(i);
      }
    }
    return dayList.join(',');
  }

  /**
   * Format times array (seconds) to HH:MM:SS
   */
  private formatTimes(times: number[]): string {
    if (!times || !Array.isArray(times)) return '';

    return times.map(t => {
      const hours = Math.floor(t / 3600);
      const minutes = Math.floor((t % 3600) / 60);
      const seconds = t % 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }).join(', ');
  }

  /**
   * Format durations array (seconds) to HH:MM:SS
   */
  private formatDurations(durations: number[]): string {
    if (!durations || !Array.isArray(durations)) return '';

    return durations.map(d => {
      const hours = Math.floor(d / 3600);
      const minutes = Math.floor((d % 3600) / 60);
      const seconds = d % 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }).join(', ');
  }
}

export default new MediaController();
