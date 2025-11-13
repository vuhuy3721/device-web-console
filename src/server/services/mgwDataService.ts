import { MGWStatus, MGWStatusHistory, MGWHealthMetrics } from '../../types/mgw';
import * as fs from 'fs';
import * as path from 'path';

/**
 * MGW Data Service
 * Receives and stores periodic status updates from MGW software
 */
export class MGWDataService {
  private currentStatus: MGWStatus | null = null;
  private history: MGWStatusHistory[] = [];
  private maxHistorySize: number = 100; // Keep last 100 updates
  private lastUpdateTime: Date | null = null;
  private updateCount: number = 0;
  private dataFilePath: string;

  constructor() {
    this.dataFilePath = path.join(__dirname, '../data/mgw-current.json');
    this.loadPersistedData();
  }

  /**
   * Receive status update from MGW
   */
  public receiveStatus(status: MGWStatus): void {
    const now = new Date();

    // Validate required fields
    if (!this.validateStatus(status)) {
      throw new Error('Invalid MGW status data');
    }

    // Update current status
    this.currentStatus = status;
    this.lastUpdateTime = now;
    this.updateCount++;

    // Add to history
    this.history.push({
      status: { ...status },
      receivedAt: now
    });

    // Trim history if too large
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(-this.maxHistorySize);
    }

    // Persist to disk
    this.persistData();

    console.log(`📊 MGW status received: conn=${status.conn}, signal=${status.csqw}, temp=${status.temp}°C`);
  }

  /**
   * Get current MGW status
   */
  public getCurrentStatus(): MGWStatus | null {
    return this.currentStatus;
  }

  /**
   * Get status history
   */
  public getHistory(limit?: number): MGWStatusHistory[] {
    if (limit) {
      return this.history.slice(-limit);
    }
    return this.history;
  }

  /**
   * Get health metrics
   */
  public getHealthMetrics(): MGWHealthMetrics {
    if (!this.currentStatus || !this.lastUpdateTime) {
      return {
        uptime: 0,
        lastUpdateTime: null,
        updateCount: this.updateCount,
        signalQuality: 'unknown',
        connectionStatus: 'unknown',
        storageUsage: 0,
        temperatureStatus: 'normal'
      };
    }

    const uptimeSeconds = Math.floor((Date.now() - this.lastUpdateTime.getTime()) / 1000);

    return {
      uptime: uptimeSeconds,
      lastUpdateTime: this.lastUpdateTime,
      updateCount: this.updateCount,
      signalQuality: this.calculateSignalQuality(this.currentStatus.csqw),
      connectionStatus: this.calculateConnectionStatus(uptimeSeconds),
      storageUsage: this.calculateStorageUsage(this.currentStatus.sdtotal, this.currentStatus.sdfree),
      temperatureStatus: this.calculateTemperatureStatus(this.currentStatus.temp)
    };
  }

  /**
   * Get formatted status for display
   */
  public getFormattedStatus(): any {
    if (!this.currentStatus) {
      return {
        available: false,
        message: 'No data received from MGW yet'
      };
    }

    const metrics = this.getHealthMetrics();

    return {
      available: true,
      connection: {
        status: this.currentStatus.conn === 1 ? 'Connected' : 'Disconnected',
        lanIP: this.currentStatus.iplan,
        wanIP: this.currentStatus.ipwan
      },
      signal: {
        csqw: this.currentStatus.csqw,
        csqm: this.currentStatus.csqm,
        rssim: this.currentStatus.rssim,
        quality: metrics.signalQuality
      },
      storage: {
        total: this.formatBytes(this.currentStatus.sdtotal),
        free: this.formatBytes(this.currentStatus.sdfree),
        used: this.formatBytes(this.currentStatus.sdtotal - this.currentStatus.sdfree),
        usagePercent: metrics.storageUsage
      },
      system: {
        temperature: `${this.currentStatus.temp.toFixed(2)}°C`,
        temperatureStatus: metrics.temperatureStatus,
        speakerErrors: this.currentStatus.spkerr
      },
      media: {
        fmStatus: this.currentStatus.fmsta ? 'ON' : 'OFF',
        currentPlaylist: this.currentStatus.playlist
      },
      metadata: {
        lastUpdate: this.lastUpdateTime,
        uptime: `${metrics.uptime} seconds ago`,
        totalUpdates: this.updateCount,
        dataAge: metrics.connectionStatus
      }
    };
  }

  /**
   * Clear all data
   */
  public clearData(): void {
    this.currentStatus = null;
    this.history = [];
    this.lastUpdateTime = null;
    this.updateCount = 0;
    this.deletePersistedData();
  }

  /**
   * Validate status data
   */
  private validateStatus(status: any): boolean {
    const required = [
      'conn', 'csqw', 'iplan', 'ipwan', 'csqm', 
      'rssim', 'spkerr', 'sdtotal', 'sdfree', 
      'fmsta', 'temp', 'playlist', 'timestamp'
    ];

    return required.every(field => status.hasOwnProperty(field));
  }

  /**
   * Calculate signal quality from CSQ
   */
  private calculateSignalQuality(csqw: number): 'excellent' | 'good' | 'fair' | 'poor' | 'unknown' {
    if (csqw === 99) return 'unknown';
    if (csqw >= 20) return 'excellent';
    if (csqw >= 15) return 'good';
    if (csqw >= 10) return 'fair';
    return 'poor';
  }

  /**
   * Calculate connection status based on last update time
   */
  private calculateConnectionStatus(uptimeSeconds: number): 'online' | 'offline' | 'unknown' {
    if (uptimeSeconds < 60) return 'online';      // < 1 minute
    if (uptimeSeconds < 300) return 'offline';    // < 5 minutes
    return 'unknown';
  }

  /**
   * Calculate storage usage percentage
   */
  private calculateStorageUsage(total: number, free: number): number {
    if (total === 0) return 0;
    return Math.round(((total - free) / total) * 100);
  }

  /**
   * Calculate temperature status
   */
  private calculateTemperatureStatus(temp: number): 'normal' | 'warning' | 'critical' {
    if (temp < 60) return 'normal';
    if (temp < 75) return 'warning';
    return 'critical';
  }

  /**
   * Format bytes to human readable
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Persist current data to disk
   */
  private persistData(): void {
    try {
      const data = {
        currentStatus: this.currentStatus,
        lastUpdateTime: this.lastUpdateTime,
        updateCount: this.updateCount
      };

      const dir = path.dirname(this.dataFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(this.dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to persist MGW data:', error);
    }
  }

  /**
   * Load persisted data from disk
   */
  private loadPersistedData(): void {
    try {
      if (fs.existsSync(this.dataFilePath)) {
        const data = JSON.parse(fs.readFileSync(this.dataFilePath, 'utf-8'));
        this.currentStatus = data.currentStatus;
        this.lastUpdateTime = data.lastUpdateTime ? new Date(data.lastUpdateTime) : null;
        this.updateCount = data.updateCount || 0;
        console.log('✅ Loaded persisted MGW data');
      }
    } catch (error) {
      console.error('Failed to load persisted MGW data:', error);
    }
  }

  /**
   * Delete persisted data
   */
  private deletePersistedData(): void {
    try {
      if (fs.existsSync(this.dataFilePath)) {
        fs.unlinkSync(this.dataFilePath);
      }
    } catch (error) {
      console.error('Failed to delete persisted MGW data:', error);
    }
  }
}

// Singleton instance
export const mgwDataService = new MGWDataService();
