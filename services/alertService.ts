
import apiClient from '../apiClient';
import { ActivityEvent } from '../types';
import { mockEvents } from '../data/mockData';

/**
 * Alert Service
 * Consumes SmartOLT-like endpoints for system and network events.
 */
export const alertService = {
  /**
   * Fetch system activity events (GET /events)
   */
  async getEvents(): Promise<ActivityEvent[]> {
    // In production: return (await apiClient.get<ActivityEvent[]>('/events')).data;
    await new Promise(r => setTimeout(r, 400));
    return mockEvents;
  },

  /**
   * Fetch critical network alarms (GET /alarms)
   */
  async getAlarms(): Promise<ActivityEvent[]> {
    // In production: return (await apiClient.get<ActivityEvent[]>('/alarms')).data;
    await new Promise(r => setTimeout(r, 500));
    return [
      { id: 'al1', message: 'OLT PGM: High Temperature Warning (45°C)', timestamp: '2 minutes ago', type: 'warning' },
      { id: 'al2', message: 'PON 0/2/1: LOS detected on multiple ONUs', timestamp: '5 minutes ago', type: 'error' },
    ];
  },

  /**
   * Fetch consolidated alerts (GET /alerts)
   */
  async getAlerts(): Promise<ActivityEvent[]> {
    // In production: return (await apiClient.get<ActivityEvent[]>('/alerts')).data;
    await new Promise(r => setTimeout(r, 300));
    return [
      { id: 'alt1', message: 'Unauthorized ONU detected on PGM Port 1/2', timestamp: 'Just now', type: 'info' },
    ];
  }
};
