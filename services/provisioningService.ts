
import apiClient from '../apiClient';
import { OnuProvisionPayload, UnconfiguredONU } from '../types';

/**
 * Provisioning Service
 * Logic for adding, removing, and modifying ONU configurations via REST API.
 */
export const provisioningService = {
  /**
   * Authorize a new ONU (POST /onus)
   */
  async provisionOnu(payload: OnuProvisionPayload): Promise<{ success: boolean; id: string }> {
    // Real call: return (await apiClient.post('/onus', payload)).data;
    console.log('API POST /onus Payload:', payload);
    
    // Simulate complex OLT processing time
    await new Promise(r => setTimeout(r, 2000));
    
    // Random failure simulation (5%)
    if (Math.random() < 0.05) {
      throw new Error('OLT rejected SN: Resource already allocated on this PON port.');
    }

    return { success: true, id: `onu_${Math.random().toString(36).substr(2, 9)}` };
  },

  /**
   * Specifically handles the authorization of a pending ONU
   * POST /onus/{id}/authorize
   */
  async authorizeOnu(onu: UnconfiguredONU): Promise<{ success: boolean }> {
    console.log(`API POST /onus/${onu.id}/authorize`, onu);
    
    // Simulate API processing delay
    await new Promise(r => setTimeout(r, 1500));

    // Simulation of possible error based on SN (just for testing error UI)
    if (onu.sn === 'ERROR_TEST_SN') {
      throw new Error('Communication Timeout: OLT did not acknowledge OMCI configuration.');
    }

    return { success: true };
  },

  /**
   * Remove an ONU (DELETE /onus/{id})
   */
  async unprovisionOnu(id: string): Promise<void> {
    // Real call: await apiClient.delete(`/onus/${id}`);
    console.log(`API DELETE /onus/${id}`);
    await new Promise(r => setTimeout(r, 1200));
  },

  /**
   * Change network mode (PUT /onus/{id}/mode)
   */
  async updateOnuMode(id: string, mode: 'Bridge' | 'Router'): Promise<void> {
    // Real call: await apiClient.put(`/onus/${id}/mode`, { mode });
    console.log(`API PUT /onus/${id}/mode`, { mode });
    await new Promise(r => setTimeout(r, 1000));
  },

  /**
   * Update VLAN configuration (PUT /onus/{id}/vlan)
   */
  async updateOnuVlan(id: string, vlan: number): Promise<void> {
    // Real call: await apiClient.put(`/onus/${id}/vlan`, { vlan });
    console.log(`API PUT /onus/${id}/vlan`, { vlan });
    await new Promise(r => setTimeout(r, 800));
  }
};
