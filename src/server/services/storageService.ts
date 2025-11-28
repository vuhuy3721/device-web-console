import * as fs from 'fs';
import * as path from 'path';

/**
 * Storage Service
 * Centralized file I/O operations for JSON data
 */

export class StorageService {
  private configDir: string;

  constructor() {
    this.configDir = path.join(__dirname, '../config');
  }

  /**
   * Read JSON file
   */
  readJson<T = any>(filename: string): T | null {
    try {
      const filePath = path.join(this.configDir, filename);
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Failed to read ${filename}:`, error);
      return null;
    }
  }

  /**
   * Write JSON file
   */
  writeJson(filename: string, data: any): boolean {
    try {
      const filePath = path.join(this.configDir, filename);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`${filename} saved successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to write ${filename}:`, error);
      return false;
    }
  }

  /**
   * Read settings.json
   */
  getSettings() {
    return this.readJson('settings.json');
  }

  /**
   * Write settings.json
   */
  saveSettings(data: any) {
    return this.writeJson('settings.json', data);
  }

  /**
   * Read status.json
   */
  getStatus() {
    return this.readJson('status.json');
  }

  /**
   * Write status.json
   */
  saveStatus(data: any) {
    return this.writeJson('status.json', data);
  }

  /**
   * Read info.json
   */
  getInfo() {
    return this.readJson('info.json');
  }

  /**
   * Write info.json
   */
  saveInfo(data: any) {
    return this.writeJson('info.json', data);
  }

  /**
   * Read schedule.json
   */
  getSchedules() {
    const data = this.readJson<any>('schedule.json');
    if (!data) return [];

    // Handle different data shapes
    if (Array.isArray(data)) return data;
    if (data.schedules && Array.isArray(data.schedules)) return data.schedules;
    if (data.data && Array.isArray(data.data.schedules)) return data.data.schedules;
    if (data.data && Array.isArray(data.data)) return data.data;

    return [];
  }

  /**
   * Write schedule.json
   */
  saveSchedules(data: any[]) {
    return this.writeJson('schedule.json', data);
  }
}

// Export singleton instance
export const storage = new StorageService();
