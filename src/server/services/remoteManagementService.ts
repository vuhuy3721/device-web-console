import * as mqtt from 'mqtt';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Remote Management Service
 * Provides dual-channel device management:
 * 1. Direct HTTP API (Primary - Always available)
 * 2. MQTT (Secondary - For IoT platform integration)
 */

interface MQTTConfig {
  server: string;
  port: number;
  username?: string;
  password?: string;
  clientId: string;
  enabled: boolean;
}

interface RemoteCommand {
  type: 'set_config' | 'reboot' | 'update_firmware' | 'get_status';
  payload: any;
  timestamp: number;
  source: 'http' | 'mqtt';
}

export class RemoteManagementService {
  private mqttClient: mqtt.MqttClient | null = null;
  private mqttConfig: MQTTConfig;
  private deviceId: string;
  private mqttConnected: boolean = false;
  private reconnectInterval: NodeJS.Timeout | null = null;
  private settingsFilePath: string;

  constructor(deviceId: string, settingsFilePath: string) {
    this.deviceId = deviceId;
    this.settingsFilePath = settingsFilePath;
    this.mqttConfig = this.loadMQTTConfig();
  }

  /**
   * Load MQTT configuration from settings.json
   */
  private loadMQTTConfig(): MQTTConfig {
    try {
      const settings = JSON.parse(fs.readFileSync(this.settingsFilePath, 'utf-8'));
      const mqtt = settings.bootstrap_mqtt_defaults || {};
      
      return {
        server: mqtt.mqtt_server || 'aiot.mobifone.vn',
        port: mqtt.mqtt_port || 6668,
        username: mqtt.mqtt_username,
        password: mqtt.mqtt_password,
        clientId: this.deviceId,
        enabled: settings.bootstrap_enabled !== false
      };
    } catch (error) {
      console.error('Failed to load MQTT config:', error);
      return {
        server: 'aiot.mobifone.vn',
        port: 6668,
        clientId: this.deviceId,
        enabled: false
      };
    }
  }

  /**
   * Initialize MQTT connection (non-blocking)
   * Device still manageable via HTTP even if MQTT fails
   */
  public initializeMQTT(): void {
    if (!this.mqttConfig.enabled) {
      console.log('MQTT disabled in configuration');
      return;
    }

    console.log(`Attempting MQTT connection to ${this.mqttConfig.server}:${this.mqttConfig.port}`);
    this.connectMQTT();
  }

  /**
   * Connect to MQTT broker with auto-reconnect
   */
  private connectMQTT(): void {
    try {
      const options: mqtt.IClientOptions = {
        clientId: this.mqttConfig.clientId,
        clean: true,
        reconnectPeriod: 30000, // 30 seconds
        connectTimeout: 10000,
        keepalive: 60,
        username: this.mqttConfig.username,
        password: this.mqttConfig.password
      };

      const brokerUrl = `mqtt://${this.mqttConfig.server}:${this.mqttConfig.port}`;
      this.mqttClient = mqtt.connect(brokerUrl, options);

      this.mqttClient.on('connect', () => {
        console.log('✅ MQTT connected successfully');
        this.mqttConnected = true;
        this.subscribeToTopics();
      });

      this.mqttClient.on('error', (error) => {
        console.warn('⚠️ MQTT connection error (HTTP API still available):', error.message);
        this.mqttConnected = false;
      });

      this.mqttClient.on('offline', () => {
        console.warn('⚠️ MQTT offline (Device still manageable via HTTP API)');
        this.mqttConnected = false;
      });

      this.mqttClient.on('message', (topic, message) => {
        this.handleMQTTCommand(topic, message);
      });

    } catch (error) {
      console.error('⚠️ MQTT initialization failed (HTTP API still available):', error);
      this.mqttConnected = false;
    }
  }

  /**
   * Subscribe to device command topics
   */
  private subscribeToTopics(): void {
    if (!this.mqttClient) return;

    const topics = [
      `device/${this.deviceId}/command`,      // Remote commands
      `device/${this.deviceId}/config`,       // Configuration updates
      `device/${this.deviceId}/reboot`,       // Reboot command
      `platform/broadcast/command`             // Platform-wide commands
    ];

    topics.forEach(topic => {
      this.mqttClient!.subscribe(topic, (err) => {
        if (err) {
          console.error(`Failed to subscribe to ${topic}:`, err);
        } else {
          console.log(`Subscribed to: ${topic}`);
        }
      });
    });
  }

  /**
   * Handle incoming MQTT commands
   */
  private handleMQTTCommand(topic: string, message: Buffer): void {
    try {
      const command: RemoteCommand = JSON.parse(message.toString());
      command.source = 'mqtt';
      
      console.log(`📨 MQTT command received on ${topic}:`, command.type);
      
      // Execute command (same logic as HTTP API)
      this.executeCommand(command);
      
    } catch (error) {
      console.error('Failed to parse MQTT command:', error);
    }
  }

  /**
   * Execute remote command (from HTTP or MQTT)
   */
  public executeCommand(command: RemoteCommand): any {
    console.log(`🔧 Executing command: ${command.type} (source: ${command.source})`);

    switch (command.type) {
      case 'set_config':
        return this.updateConfiguration(command.payload);
      
      case 'get_status':
        return this.getDeviceStatus();
      
      case 'reboot':
        return this.rebootDevice(command.payload?.delay || 5);
      
      case 'update_firmware':
        return this.updateFirmware(command.payload);
      
      default:
        throw new Error(`Unknown command type: ${command.type}`);
    }
  }

  /**
   * Update device configuration (including MQTT settings)
   */
  private updateConfiguration(config: any): any {
    try {
      const settings = JSON.parse(fs.readFileSync(this.settingsFilePath, 'utf-8'));
      
      // Merge new config
      const updatedSettings = { ...settings, ...config };
      
      // Save to file
      fs.writeFileSync(
        this.settingsFilePath,
        JSON.stringify(updatedSettings, null, 2),
        'utf-8'
      );

      // If MQTT config changed, reconnect
      if (config.bootstrap_mqtt_defaults) {
        console.log('MQTT configuration updated, reconnecting...');
        this.mqttConfig = this.loadMQTTConfig();
        this.reconnectMQTT();
      }

      return {
        success: true,
        message: 'Configuration updated successfully',
        config: updatedSettings
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to update configuration',
        error: error.message
      };
    }
  }

  /**
   * Get current device status
   */
  private getDeviceStatus(): any {
    const settings = JSON.parse(fs.readFileSync(this.settingsFilePath, 'utf-8'));
    
    return {
      deviceId: this.deviceId,
      mqttConnected: this.mqttConnected,
      mqttServer: this.mqttConfig.server,
      mqttPort: this.mqttConfig.port,
      uptime: process.uptime(),
      timestamp: Date.now(),
      config: settings
    };
  }

  /**
   * Reboot device with delay
   */
  private rebootDevice(delaySeconds: number): any {
    console.log(`🔄 Device will reboot in ${delaySeconds} seconds`);
    
    setTimeout(() => {
      // Use platform-specific reboot command
      const { exec } = require('child_process');
      exec('sudo reboot', (error: any) => {
        if (error) {
          console.error('Reboot failed:', error);
        }
      });
    }, delaySeconds * 1000);

    return {
      success: true,
      message: `Device will reboot in ${delaySeconds} seconds`
    };
  }

  /**
   * Update firmware (placeholder)
   */
  private updateFirmware(payload: any): any {
    // Implement firmware update logic
    return {
      success: false,
      message: 'Firmware update not implemented yet'
    };
  }

  /**
   * Reconnect to MQTT broker
   */
  public reconnectMQTT(): void {
    if (this.mqttClient) {
      this.mqttClient.end(true);
      this.mqttClient = null;
    }
    
    setTimeout(() => {
      this.connectMQTT();
    }, 2000);
  }

  /**
   * Publish device status to MQTT (if connected)
   */
  public publishStatus(status: any): void {
    if (!this.mqttConnected || !this.mqttClient) {
      return; // Silent fail - HTTP API is primary channel
    }

    const topic = `device/${this.deviceId}/status`;
    this.mqttClient.publish(topic, JSON.stringify(status), { qos: 1 });
  }

  /**
   * Get MQTT connection status
   */
  public getMQTTStatus(): { connected: boolean; server: string; port: number } {
    return {
      connected: this.mqttConnected,
      server: this.mqttConfig.server,
      port: this.mqttConfig.port
    };
  }

  /**
   * Update MQTT configuration and reconnect
   */
  public updateMQTTConfig(server: string, port: number, username?: string, password?: string): void {
    const settings = JSON.parse(fs.readFileSync(this.settingsFilePath, 'utf-8'));
    
    settings.bootstrap_mqtt_defaults = {
      mqtt_server: server,
      mqtt_port: port,
      mqtt_username: username,
      mqtt_password: password,
      mqtt_security: username ? 1 : 0
    };

    fs.writeFileSync(
      this.settingsFilePath,
      JSON.stringify(settings, null, 2),
      'utf-8'
    );

    this.mqttConfig = this.loadMQTTConfig();
    this.reconnectMQTT();
  }

  /**
   * Cleanup on shutdown
   */
  public shutdown(): void {
    if (this.mqttClient) {
      this.mqttClient.end();
    }
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
    }
  }
}
