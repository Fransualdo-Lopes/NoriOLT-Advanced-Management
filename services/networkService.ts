
import apiClient from '../apiClient';
import { SummaryStats, OLT, ONU, ActivityEvent } from '../types';
import { mockSummary, mockOLTs, mockONUs, mockEvents } from '../data/mockData';

/**
 * Network Service
 * Handles data fetching for the OLT Management System.
 * Currently uses mock data with artificial delays to simulate real network latency.
 */
export const networkService = {
  async getDashboardSummary(): Promise<SummaryStats> {
    // In production: return (await apiClient.get<SummaryStats>('/dashboard/summary')).data;
    await new Promise(r => setTimeout(r, 400));
    return mockSummary;
  },

  async getOlts(): Promise<OLT[]> {
    // In production: return (await apiClient.get<OLT[]>('/olts')).data;
    await new Promise(r => setTimeout(r, 300));
    return mockOLTs;
  },

  async getOnus(): Promise<ONU[]> {
    // In production: return (await apiClient.get<ONU[]>('/onus')).data;
    await new Promise(r => setTimeout(r, 500));
    return mockONUs;
  },

  async getEvents(): Promise<ActivityEvent[]> {
    await new Promise(r => setTimeout(r, 200));
    return mockEvents;
  },

  async provisionOnu(data: any): Promise<void> {
    // In production: await apiClient.post('/onus/provision', data);
    console.log('Provisioning ONU with data:', data);
    await new Promise(r => setTimeout(r, 1500));
  }
};
