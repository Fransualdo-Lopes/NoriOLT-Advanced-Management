
import apiClient from '../apiClient';
import { ONU, OnuDetailed } from '../types';
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
    await new Promise(r => setTimeout(r, 800));
    
    let filtered = [...mockONUs];

    if (params.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(o => 
        o.name.toLowerCase().includes(s) || 
        o.sn.toLowerCase().includes(s) ||
        (o.odb && o.odb.toLowerCase().includes(s)) ||
        (o.zone && o.zone.toLowerCase().includes(s))
      );
    }

    if (params.status && params.status !== 'any') {
      filtered = filtered.filter(o => o.status === params.status);
    }

    if (params.mode && params.mode !== 'any') {
      filtered = filtered.filter(o => o.mode === params.mode);
    }

    if (params.olt_id && params.olt_id !== 'any') {
      filtered = filtered.filter(o => o.olt_id === params.olt_id || o.olt?.includes(params.olt_id));
    }

    const itemsPerPage = params.limit || 100;
    const total = filtered.length;
    const lastPage = Math.max(1, Math.ceil(total / itemsPerPage));
    
    return {
      data: filtered,
      total: total,
      current_page: params.page,
      last_page: lastPage,
      per_page: itemsPerPage
    };
  },

  async getOnuById(id: string): Promise<OnuDetailed> {
    await new Promise(r => setTimeout(r, 600));
    const base = mockONUs.find(o => o.id === id);
    if (!base) throw new Error('Hardware component not found in registry');

    // Transform into detailed record
    return {
      ...base,
      vendor: base.sn.startsWith('HWTC') ? 'Huawei' : 'ZTE',
      model: base.type || 'EG8145X6',
      firmware: 'V5R019C20S155',
      software_version: 'V500R019C20',
      rx_power: base.signal,
      tx_power: 2.15,
      distance: 5674,
      temperature: 42,
      voltage: 3.25,
      frame: 0,
      slot: 3,
      port_id: 6,
      pon_type: 'GPON',
      ethernet_ports: [
        { id: '1', label: 'eth_0/1', status: 'Up', admin_status: 'Enabled', speed: '1000M Full', mode: 'LAN' },
        { id: '2', label: 'eth_0/2', status: 'Down', admin_status: 'Enabled', speed: 'N/A', mode: 'LAN' },
        { id: '3', label: 'eth_0/3', status: 'Down', admin_status: 'Enabled', speed: 'N/A', mode: 'LAN' },
        { id: '4', label: 'eth_0/4', status: 'Down', admin_status: 'Enabled', speed: 'N/A', mode: 'LAN' },
      ],
      wifi_ssids: [
        { id: 'w1', name: 'JETZ_2.4G_984A', frequency: '2.4GHz', status: true, security: 'WPA2-PSK', channel: 6 },
        { id: 'w2', name: 'JETZ_5G_984A', frequency: '5GHz', status: true, security: 'WPA2-AES', channel: 36 },
      ],
      service_ports: [
        { id: '21294', svlan: 100, cvlan: base.vlan, download: '1G', upload: '500M', status: 'Up' }
      ],
      voip_details: base.voip ? { status: 'Registered', ip: '10.20.30.45', uri: 'sip:55119988@sip.jetz.com' } : undefined
    };
  }
};
