export interface BootstrapMQTTDefaults {
    mqtt_port: number;
    mqtt_security: number;
    mqtt_server: string;
}

export interface BootstrapSettings {
    bootstrap_enabled: boolean;
    bootstrap_mqtt_defaults: BootstrapMQTTDefaults;
    bootstrap_server: string;
    classd: number;
    disabled: number;
    external_id: string;
    external_key: string;
    fm_auto: number;
    fm_threshold: number;
    fm_volume: number;
    ioct: number;
    main_volume: number;
    mobile_mode: number;
    sim: number;
    txtype: number;
}

export interface ConnectionInfo {
    status: string;
    signalStrength: number;
    networkType: string;
}

export interface MediaInfo {
    currentTrack: string;
    volume: number;
    isPlaying: boolean;
}

export interface PlayerControls {
    play: () => void;
    pause: () => void;
    stop: () => void;
    next: () => void;
    previous: () => void;
}

export interface DeviceStatus {
    uptime: number;
    temperature: number;
    memoryUsage: number;
}

export interface NetworkInfo {
    type: string;
    signalStrength: number;
    carrier: string;
}

export interface AdminSettings {
    password: string;
    accessLevel: number;
}

export interface AboutInfo {
    version: string;
    author: string;
    license: string;
}