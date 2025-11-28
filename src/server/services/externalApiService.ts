import { EXTERNAL_API_URL, DEFAULT_TIMEOUT, DELETE_TIMEOUT } from '../config/constants';

/**
 * External API Service
 * Centralized service for making requests to external device API
 */

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  timeout?: number;
  headers?: Record<string, string>;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export class ExternalApiService {
  private baseUrl: string;

  constructor(baseUrl: string = EXTERNAL_API_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make a fetch request with timeout and error handling
   */
  private async fetchWithTimeout(
    url: string,
    options: FetchOptions = {}
  ): Promise<Response> {
    const { method = 'GET', body, timeout = DEFAULT_TIMEOUT, headers = {} } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const fetchOptions: RequestInit = {
        method,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };

      if (body) {
        fetchOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Generic GET request
   */
  async get<T = any>(endpoint: string): Promise<ApiResponse<T> | null> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}${endpoint}`);

      if (!response.ok) {
        console.warn(`External API GET ${endpoint} failed: ${response.status} ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn(`External API GET ${endpoint} error:`, error);
      return null;
    }
  }

  /**
   * Generic POST request
   */
  async post<T = any>(endpoint: string, body: any): Promise<ApiResponse<T> | null> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        body
      });

      if (!response.ok) {
        console.warn(`External API POST ${endpoint} failed: ${response.status} ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn(`External API POST ${endpoint} error:`, error);
      return null;
    }
  }

  /**
   * Generic DELETE request
   */
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T> | null> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        timeout: DELETE_TIMEOUT
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DELETE failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`External API DELETE ${endpoint} error:`, error);
      throw error;
    }
  }

  /**
   * Get settings from external API
   */
  async getSettings() {
    return this.get('/api/settings');
  }

  /**
   * Get status from external API
   */
  async getStatus() {
    return this.get('/api/status');
  }

  /**
   * Get device info from external API
   */
  async getInfo() {
    return this.get('/api/info');
  }

  /**
   * Get schedules from external API
   */
  async getSchedules(): Promise<any[] | null> {
    const response = await this.get<{ count: number; schedules: any[] }>('/api/schedules');

    if (!response) return null;

    // Handle multiple response shapes
    if (response.data && Array.isArray(response.data.schedules)) {
      return response.data.schedules;
    }
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    if (Array.isArray(response)) {
      return response;
    }

    console.warn('Unexpected schedule response shape from external API');
    return null;
  }

  /**
   * Delete a schedule by ID
   */
  async deleteSchedule(mediaId: number) {
    return this.delete(`/api/schedules/${mediaId}`);
  }

  /**
   * Reboot device
   */
  async reboot(option: number = 1) {
    return this.post('/api/reboot', { option });
  }

  /**
   * Get logs
   */
  async getLogs(limit: number = 50) {
    return this.get(`/api/logs?limit=${limit}`);
  }
}

// Export singleton instance
export const externalApi = new ExternalApiService();
