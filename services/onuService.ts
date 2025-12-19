
import apiClient from '../apiClient';
import { ONU } from '../types';
import { mockONUs } from '../data/mockData';

export interface OnuListResponse {
  data: ONU[];
  total: number;
  current_page: number;
  last_page: number;
}

/**
 * ONU Service
 * Manages interactions with individual Optical Network Units.
 */
export const onuService = {
  async getOnus(params: { page: number; search?: string }): Promise<OnuListResponse> {
    // Real call: return (await apiClient.get<OnuListResponse>('/onus', { params })).data;
    await new Promise(r => setTimeout(r, 600));
    
    let filtered = [...mockONUs];
    if (params.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(o => 
        o.name.toLowerCase().includes(s) || 
        o.sn.toLowerCase().includes(s)
      );
    }

    return {
      data: filtered,
      total: filtered.length,
      current_page: params.page,
      last_page: 1
    };
  },

  async getOnuById(id: string): Promise<ONU> {
    // Real call: return (await apiClient.get<ONU>(`/onus/${id}`)).data;
    await new Promise(r => setTimeout(r, 300));
    const onu = mockONUs.find(o => o.id === id);
    if (!onu) throw new Error('ONU not found');
    return onu;
  }
};
