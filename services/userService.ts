
import { User, UserGroup, RestrictionGroup, AuditLog } from '../types';

/**
 * Mock User Management Service
 * Handles RBAC business logic and data simulation.
 */

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Marcos lima silva', email: 'ti2@jetzinternet.com.br', username: 'marcos', role: 'ADMIN', groups: ['admins'], status: 'active', lastLogin: '18-Dec-2025 08:31:13' },
  { id: 'u2', name: 'Suporte Jetz', email: 'suporte@jetzinternet.com.br', username: 'suporte', role: 'ADMIN', groups: ['admins'], status: 'active', lastLogin: '20-Dec-2025 19:39:09' },
  { id: 'u3', name: 'Suporte 3 Jetz', email: 'contatos2@jetzinternet.com.br', username: 'suporte3', role: 'NOC', groups: ['tech_users'], status: 'active', lastLogin: '11-Sep-2025 14:55:42' },
  { id: 'u4', name: 'Financeiro Ulianopolis', email: 'financeiro.uli@jetzinternet.com.br', username: 'financeiro', role: 'NOC', groups: ['tech_users'], restrictionGroupId: 'rg1', status: 'active', lastLogin: '18-Dec-2025 17:15:16' }
];

const MOCK_GROUPS: UserGroup[] = [
  { id: 'admins', name: 'Admins', description: 'Full system access', permissions: ['*'], userCount: 2 },
  { id: 'tech_users', name: 'Tech Users', description: 'Network operations staff', permissions: ['onu.view_configured', 'onu.authorize'], userCount: 12 }
];

const MOCK_RESTRICTIONS: RestrictionGroup[] = [
  { id: 'rg1', name: 'Ulianópolis', allowedOlts: ['ULI - Jetz Internet'], allowedZones: ['CEO 001'], allowedActions: ['view'], readOnly: true, userCount: 1 }
];

const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'l1', userId: 'u1', userName: 'marcos', action: 'CREATE_USER', resource: 'joshuaemanuel077@gmail.com', timestamp: '2025-12-20 08:49:55', ip: '187.55.12.102', result: 'success' },
  { id: 'l2', userId: 'u1', userName: 'marcos', action: 'AUTHORIZE_ONU', resource: 'HWTC4A2211C9', timestamp: '2025-12-20 08:55:12', ip: '187.55.12.102', result: 'success' }
];

export const userService = {
  async getUsers(): Promise<User[]> {
    await new Promise(r => setTimeout(r, 400));
    return MOCK_USERS;
  },
  
  async getGroups(): Promise<UserGroup[]> {
    await new Promise(r => setTimeout(r, 300));
    return MOCK_GROUPS;
  },

  async getRestrictions(): Promise<RestrictionGroup[]> {
    await new Promise(r => setTimeout(r, 300));
    return MOCK_RESTRICTIONS;
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    await new Promise(r => setTimeout(r, 500));
    return MOCK_AUDIT_LOGS;
  },

  async createUser(data: any): Promise<void> {
    console.log('API POST /users', data);
    await new Promise(r => setTimeout(r, 1000));
  },

  async deleteUser(id: string): Promise<void> {
    console.log('API DELETE /users/' + id);
    await new Promise(r => setTimeout(r, 800));
  }
};
