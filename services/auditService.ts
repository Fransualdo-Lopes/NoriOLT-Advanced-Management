
import { AuditLogEntry, Manufacturer } from '../types';

/**
 * Audit Log Service
 * Manages the immutable history of system actions.
 */

const MOCK_LOGS: AuditLogEntry[] = [
  {
    id: 'l1',
    action: 'ONU Reboot',
    olt: { name: 'PGM - Jetz Internet', manufacturer: 'Huawei' },
    onu_sn: 'HWTC4A2211C9',
    user: { username: 'marcos', role: 'ADMIN' },
    ip: '187.55.12.102',
    timestamp: '2025-12-20 08:55:12',
    status: 'success'
  },
  {
    id: 'l2',
    action: 'Modify VLAN',
    olt: { name: 'ULI - Jetz Internet', manufacturer: 'ZTE' },
    onu_sn: 'ZTEGC6C8B83A',
    user: { username: 'suporte3', role: 'NOC' },
    ip: '177.42.10.55',
    timestamp: '2025-12-20 09:10:05',
    status: 'failure',
    errorMessage: 'OLT returned timeout (Error 0x8001)',
    changes: [{ field: 'vlan', oldValue: 100, newValue: 200 }]
  },
  {
    id: 'l3',
    action: 'Update General Settings',
    user: { username: 'marcos', role: 'ADMIN' },
    ip: '187.55.12.102',
    timestamp: '2025-12-19 14:20:45',
    status: 'success',
    changes: [{ field: 'title', oldValue: 'JETZ OLT', newValue: 'JETZ INTERNET' }]
  },
  {
    id: 'l4',
    action: 'Change Speed Profile',
    olt: { name: 'DEU - Jetz Internet', manufacturer: 'Nokia' },
    onu_sn: 'ALCLB3CAA112',
    user: { username: 'financeiro', role: 'NOC' },
    ip: '189.12.5.4',
    timestamp: '2025-12-18 17:15:16',
    status: 'success',
    changes: [{ field: 'profile', oldValue: '100M', newValue: '300M' }]
  }
];

export interface AuditFilters {
  search?: string;
  action?: string;
  olt?: string;
  user?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const auditService = {
  async getLogs(filters: AuditFilters): Promise<AuditLogEntry[]> {
    await new Promise(r => setTimeout(r, 600));
    
    let filtered = [...MOCK_LOGS];
    
    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(l => 
        l.action.toLowerCase().includes(s) || 
        l.onu_sn?.toLowerCase().includes(s) ||
        l.user.username.toLowerCase().includes(s) ||
        l.ip.includes(s)
      );
    }
    
    if (filters.status && filters.status !== 'any') {
      filtered = filtered.filter(l => l.status === filters.status);
    }

    if (filters.action && filters.action !== 'any') {
      filtered = filtered.filter(l => l.action === filters.action);
    }

    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  async exportLogs(format: 'csv' | 'json'): Promise<string> {
    await new Promise(r => setTimeout(r, 1200));
    return format === 'csv' ? "Action,OLT,ONU,User,IP,Date\n..." : JSON.stringify(MOCK_LOGS);
  }
};
