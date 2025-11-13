/**
 * MGW (Media Gateway) Data Types
 */

export interface MGWStatus {
  conn: number;           // Connection status (0 = disconnected, 1 = connected)
  csqw: number;           // CSQ Wireless signal strength (0-99)
  iplan: string;          // LAN IP address
  ipwan: string;          // WAN IP address
  csqm: number;           // CSQ Mobile signal strength (0-31)
  rssim: number;          // RSSI Mobile (signal strength in dBm)
  spkerr: number;         // Speaker error count
  sdtotal: number;        // SD card total size (bytes)
  sdfree: number;         // SD card free space (bytes)
  fmsta: boolean;         // FM status (true = on, false = off)
  temp: number;           // Device temperature (Celsius)
  playlist: number;       // Current playlist ID
  timestamp: number;      // Unix timestamp
}

export interface MGWStatusHistory {
  status: MGWStatus;
  receivedAt: Date;
}

export interface MGWHealthMetrics {
  uptime: number;                    // Seconds since last data
  lastUpdateTime: Date | null;       // Last received timestamp
  updateCount: number;                // Total updates received
  signalQuality: 'excellent' | 'good' | 'fair' | 'poor' | 'unknown';
  connectionStatus: 'online' | 'offline' | 'unknown';
  storageUsage: number;               // Percentage (0-100)
  temperatureStatus: 'normal' | 'warning' | 'critical';
}
