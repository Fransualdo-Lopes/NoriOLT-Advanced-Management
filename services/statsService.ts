
import apiClient from '../apiClient';

/**
 * SmartOLT-like API Response Interfaces
 */
export interface DashboardStatsResponse {
  total_onus: number;
  online_onus: number;
  offline_onus: number;
  waiting_auth: number;
}

export interface OnuStatsResponse {
  low_signal_warning: number;
  low_signal_critical: number;
  power_fail: number;
  los: number;
  na: number;
}

export interface AlertsSummaryResponse {
  critical_count: number;
  warning_count: number;
  last_sync: string;
}

/**
 * Stats Service
 * Encapsulates the logic for fetching specific network health metrics.
 */
export const statsService = {
  async getDashboardStats(): Promise<DashboardStatsResponse> {
    // Real call: return (await apiClient.get<DashboardStatsResponse>('/dashboard/stats')).data;
    // Mocking SmartOLT pattern
    await new Promise(r => setTimeout(r, 600));
    return {
      total_onus: 7272,
      online_onus: 6766,
      offline_onus: 506,
      waiting_auth: 3
    };
  },

  async getOnuStats(): Promise<OnuStatsResponse> {
    // Real call: return (await apiClient.get<OnuStatsResponse>('/onus/stats')).data;
    await new Promise(r => setTimeout(r, 800));
    return {
      low_signal_warning: 50,
      low_signal_critical: 9,
      power_fail: 319,
      los: 13,
      na: 174
    };
  },

  async getAlertsSummary(): Promise<AlertsSummaryResponse> {
    // Real call: return (await apiClient.get<AlertsSummaryResponse>('/alerts/summary')).data;
    await new Promise(r => setTimeout(r, 400));
    return {
      critical_count: 12,
      warning_count: 45,
      last_sync: new Date().toISOString()
    };
  }
};
