/**
 * Application Constants
 */

export const EXTERNAL_API_URL = 'http://100.78.142.94:8080';

export const DEFAULT_TIMEOUT = 5000; // 5 seconds
export const DELETE_TIMEOUT = 10000; // 10 seconds

export const API_ENDPOINTS = {
  SETTINGS: '/api/settings',
  STATUS: '/api/status',
  INFO: '/api/info',
  SCHEDULES: '/api/schedules',
  REBOOT: '/api/reboot',
  LOGS: '/api/logs'
};

export const STATUS_MODES = {
  NORMAL: 0,
  SCHEDULE: 1
};

export const REPEAT_TYPES = {
  MONTH_DAYS: 0,
  WEEK_DAYS: 1
};

export const NETWORK_TYPES = {
  THREE_G: 2,
  FOUR_G: 3
};
