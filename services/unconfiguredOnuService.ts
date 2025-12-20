
import { UnconfiguredONU } from '../types';

/**
 * Unconfigured ONU Service
 * Consumes endpoints for pending authorizations following SmartOLT conventions.
 */
export const unconfiguredOnuService = {
  async getUnconfiguredOnus(oltId?: string): Promise<UnconfiguredONU[]> {
    // Simulação de latência de rede OLT
    await new Promise(r => setTimeout(r, 600));

    const mockData: UnconfiguredONU[] = [
      {
        id: 'u-98421',
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
        id: 'u-98422',
        sn: 'HWTC7BAA3CAA',
        pon_type: 'GPON',
        board: 0,
        port: 3,
        pon_description: 'GPON 0/3',
        model: 'EG8145X6',
        olt_id: '1',
        olt_name: 'PGM - Jetz Internet',
        supports_immediate_auth: false
      },
      {
        id: 'u-98423',
        sn: 'HWTC9D70C5B4',
        pon_type: 'GPON',
        board: 0,
        port: 2,
        pon_description: 'GPON 0/2',
        model: 'EG8145X6-10',
        olt_id: '2',
        olt_name: 'ULI - Jetz Internet',
        supports_immediate_auth: true
      }
    ];

    if (oltId && oltId !== 'any') {
      return mockData.filter(o => o.olt_id === oltId);
    }

    return mockData;
  }
};
