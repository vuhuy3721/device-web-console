import { Request, Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

export class MediaController {
    private scheduleFilePath: string;
    
    constructor() {
        this.scheduleFilePath = path.join(__dirname, '../config/schedule.json'); // Initialize if needed
    }
    public getListMedia(req: Request, res: Response): void {
        // Logic to retrieve list of media files from schedule.json
        fs.readFile(this.scheduleFilePath, 'utf8', (err, data) => {
            if (err) {
                res.status(500).json({ error: 'Failed to read schedule file' });
                return;
            }
            try {
                const schedules = JSON.parse(data);
                
                // Transform schedule data to media format
                const mediaFiles = Array.isArray(schedules) ? schedules.map(schedule => ({
                    id: schedule.mid || 'Unknown',
                    mid: schedule.mid,
                    mode: schedule.mode === 1 ? 'SCHEDULE' : schedule.mode === 0 ? 'NORMAL' : 'UNKNOWN',
                    priority: schedule.prio || 0,
                    created: schedule.created ? new Date(schedule.created * 1000).toLocaleString('en-GB') : '',
                    expired: schedule.expired ? new Date(schedule.expired * 1000).toLocaleString('en-GB') : '',
                    start: schedule.start ? new Date(schedule.start * 1000).toLocaleString('en-GB') : '',
                    repeatType: schedule.repeat === 0 ? 'MONTH DAYS' : 'WEEK DAYS',
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
            } catch (parseError) {
                res.status(500).json({ error: 'Failed to parse schedule file' });
            }
        });
    }

    private formatDays(days: number): string {
        if (!days) return '';
        
        // Convert binary representation to day numbers
        const dayList: number[] = [];
        for (let i = 1; i <= 31; i++) {
            if (days & (1 << (i - 1))) {
                dayList.push(i);
            }
        }
        return dayList.join(',');
    }

    private formatTimes(times: number[]): string {
        if (!times || !Array.isArray(times)) return '';
        
        return times.map(t => {
            const hours = Math.floor(t / 3600);
            const minutes = Math.floor((t % 3600) / 60);
            const seconds = t % 60;
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }).join(', ');
    }

    private formatDurations(durations: number[]): string {
        if (!durations || !Array.isArray(durations)) return '';
        
        return durations.map(d => {
            const hours = Math.floor(d / 3600);
            const minutes = Math.floor((d % 3600) / 60);
            const seconds = d % 60;
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }).join(', ');
    }
    public getMediaDetailInfo(req: Request, res: Response): void {
        // Logic to retrieve media information
        res.json({ message: 'Media information retrieved successfully.' });
    }

    public playMedia(req: Request, res: Response): void {
        // Logic to play media
        res.json({ message: 'Media is now playing.' });
    }

    public pauseMedia(req: Request, res: Response): void {
        // Logic to pause media
        res.json({ message: 'Media is paused.' });
    }

    public stopMedia(req: Request, res: Response): void {
        // Logic to stop media
        res.json({ message: 'Media has been stopped.' });
    }

    public setVolume(req: Request, res: Response): void {
        const volume = req.body.volume;
        // Logic to set media volume
        res.json({ message: `Volume set to ${volume}.` });
    }
    
}

export default new MediaController();