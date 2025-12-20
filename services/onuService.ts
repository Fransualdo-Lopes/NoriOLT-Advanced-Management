
import apiClient from '../apiClient';
import { ONU } from '../types';
import { mockONUs } from '../data/mockData';

export interface OnuFilters {
  search?: string;
  olt_id?: string;
  board?: string;
  port?: string;
  zone?: string;
  odb?: string;
  vlan?: string;
  onu_type?: string;
  profile?: string;
  pon_type?: string;
  status?: string;
  signal_level?: string;
  mode?: string;
  // Added missing optional filters used in OnuFiltersBar
  mgmt_ip?: string;
  tr069?: string;
  voip?: string;
  catv?: string;
  download?: string;
  upload?: string;
  page: number;
  limit: number;
}

export interface OnuListResponse {
  data: ONU[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}

/**
 * ONU Service
 * Manages interactions with individual Optical Network Units.
 */
export const onuService = {
  /**
   * Fetches configured ONUs with advanced filtering and pagination.
   */
  async getOnus(params: OnuFilters): Promise<OnuListResponse> {
    // In a real production environment: 
    // const response = await apiClient.get<OnuListResponse>('/onus', { params });
    // return response.data;

    // Simulation logic for high-fidelity demonstration
    await new Promise(r => setTimeout(r, 800));
    
    let filtered = [...mockONUs];

    // Simulate search filter
    if (params.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(o => 
        o.name.toLowerCase().includes(s) || 
        o.sn.toLowerCase().includes(s) ||
        (o.odb && o.odb.toLowerCase().includes(s)) ||
        (o.zone && o.zone.toLowerCase().includes(s))
      );
    }

    // Simulate status filter
    if (params.status && params.status !== 'any') {
      filtered = filtered.filter(o => o.status === params.status);
    }

    // Simulate mode filter
    if (params.mode && params.mode !== 'any') {
      filtered = filtered.filter(o => o.mode === params.mode);
    }

    // Simulate OLT filter
    if (params.olt_id && params.olt_id !== 'any') {
      filtered = filtered.filter(o => o.olt_id === params.olt_id || o.olt?.includes(params.olt_id));
    }

    // Basic paging simulation
    const itemsPerPage = params.limit || 100;
    const total = filtered.length;
    const lastPage = Math.max(1, Math.ceil(total / itemsPerPage));
    
    return {
      data: filtered, // In a real API this would be sliced
      total: total,
      current_page: params.page,
      last_page: lastPage,
      per_page: itemsPerPage
    };
  },

  async getOnuById(id: string): Promise<ONU> {
    await new Promise(r => setTimeout(r, 300));
    const onu = mockONUs.find(o => o.id === id);
    if (!onu) throw new Error('ONU not found');
    return onu;
  }
};
