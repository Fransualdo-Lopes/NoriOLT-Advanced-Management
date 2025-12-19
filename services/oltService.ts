
import apiClient from '../apiClient';
import { OLT } from '../types';
import { mockOLTs } from '../data/mockData';

export interface OltPort {
  id: number;
  name: string;
  onus_count: number;
  status: 'active' | 'inactive';
}

/**
 * OLT Service
 * Handles fetching OLT chassis information and port-level statistics.
 */
export const oltService = {
  async getOlts(): Promise<OLT[]> {
    // Real call: return (await apiClient.get<OLT[]>('/olts')).data;
    await new Promise(r => setTimeout(r, 400));
    return mockOLTs;
  },

  async getOltPorts(oltId: string): Promise<OltPort[]> {
    // Real call: return (await apiClient.get<OltPort[]>(`/olts/${oltId}/ports`)).data;
    await new Promise(r => setTimeout(r, 300));
    return [
      { id: 1, name: 'GPON 0/1', onus_count: 64, status: 'active' },
      { id: 2, name: 'GPON 0/2', onus_count: 32, status: 'active' },
      { id: 3, name: 'GPON 0/3', onus_count: 12, status: 'inactive' },
    ];
  }
};
