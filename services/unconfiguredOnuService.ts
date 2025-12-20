
import { UnconfiguredONU } from '../types';

/**
 * Unconfigured ONU Service
 * Consumes endpoints for pending authorizations.
 */
export const unconfiguredOnuService = {
  async getUnconfiguredOnus(oltId?: string): Promise<UnconfiguredONU[]> {
    // Simulate API Latency
    await new Promise(r => setTimeout(r, 600));

    const mockData: UnconfiguredONU[] = [
      {
        id: 'u-1',
        sn: 'HWTC9D70C5B4',
        pon_type: 'GPON',
        board: 0,
        port: 2,
        pon_description: 'GPON 0/2',
        model: 'EG8145X6-10',
        olt_id: '2',
        olt_name: 'ULI - Jetz Internet',
        supports_immediate_auth: true
      },
      {
        id: 'u-2',
        sn: 'HWTC6C8B83A5',
        pon_type: 'GPON',
        board: 0,
        port: 12,
        pon_description: 'GPON 0/12',
        model: 'EG8010H',
        olt_id: '1',
        olt_name: 'PGM - Jetz Internet',
        supports_immediate_auth: true
      },
      {
        id: 'u-3',
        sn: 'HWTC7BAA3CAA',
        pon_type: 'GPON',
        board: 0,
        port: 3,
        pon_description: 'GPON 0/3',
        model: 'EG8010H',
        olt_id: '1',
        olt_name: 'PGM - Jetz Internet',
        supports_immediate_auth: false
      }
    ];

    if (oltId && oltId !== 'any') {
      return mockData.filter(o => o.olt_id === oltId);
    }

    return mockData;
  }
};
