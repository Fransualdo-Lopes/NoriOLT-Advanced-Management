
import { ProvisioningPreset } from '../types';

/**
 * Provisioning Preset Service
 * Handles CRUD for reusable authorization templates.
 */

const MOCK_PRESETS: ProvisioningPreset[] = [
  {
    id: 'pr-1',
    name: 'Residential 300M Bridge',
    onu_type: 'EG8010H',
    line_profile: 'LINE_300M',
    service_profile: 'SRV_DATA_ONLY',
    vlan: 100,
    mode: 'Bridge',
    pppoe_enabled: false,
    voip_enabled: false,
    tv_enabled: false,
    description: 'Standard 300Mbps bridge for routers.',
    created_at: '2025-01-10T12:00:00Z'
  },
  {
    id: 'pr-2',
    name: 'Residential 600M HGU Router',
    onu_type: 'EG8145X6',
    line_profile: 'LINE_600M',
    service_profile: 'SRV_FULL_TRIPLE',
    vlan: 200,
    mode: 'Router',
    pppoe_enabled: true,
    voip_enabled: true,
    tv_enabled: true,
    description: 'Full Triple-Play configuration for Wi-Fi 6 ONUs.',
    created_at: '2025-02-15T09:30:00Z'
  },
  {
    id: 'pr-3',
    name: 'Business Dedicated 1G',
    onu_type: 'ANY',
    line_profile: 'LINE_1G_DED',
    service_profile: 'SRV_CORP',
    vlan: 1000,
    mode: 'Bridge',
    pppoe_enabled: false,
    voip_enabled: false,
    tv_enabled: false,
    description: 'Corporate dedicated link with high priority.',
    created_at: '2025-03-01T14:20:00Z'
  }
];

export const presetService = {
  /**
   * Fetch all presets (GET /presets)
   */
  async getPresets(): Promise<ProvisioningPreset[]> {
    await new Promise(r => setTimeout(r, 400));
    const saved = localStorage.getItem('nori_presets');
    return saved ? JSON.parse(saved) : MOCK_PRESETS;
  },

  /**
   * Create new preset (POST /presets)
   */
  async createPreset(preset: Omit<ProvisioningPreset, 'id' | 'created_at'>): Promise<ProvisioningPreset> {
    await new Promise(r => setTimeout(r, 600));
    const all = await this.getPresets();
    const newPreset: ProvisioningPreset = {
      ...preset,
      id: `pr_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    };
    const updated = [...all, newPreset];
    localStorage.setItem('nori_presets', JSON.stringify(updated));
    return newPreset;
  },

  /**
   * Update preset (PUT /presets/{id})
   */
  async updatePreset(id: string, preset: Partial<ProvisioningPreset>): Promise<ProvisioningPreset> {
    await new Promise(r => setTimeout(r, 500));
    const all = await this.getPresets();
    const index = all.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Preset not found');
    
    const updatedPreset = { ...all[index], ...preset };
    all[index] = updatedPreset;
    localStorage.setItem('nori_presets', JSON.stringify(all));
    return updatedPreset;
  },

  /**
   * Delete preset (DELETE /presets/{id})
   */
  async deletePreset(id: string): Promise<void> {
    await new Promise(r => setTimeout(r, 400));
    const all = await this.getPresets();
    const filtered = all.filter(p => p.id !== id);
    localStorage.setItem('nori_presets', JSON.stringify(filtered));
  }
};
