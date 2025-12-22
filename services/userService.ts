
import { User, UserGroup, RestrictionGroup, AuditLog, UserCreationPayload } from '../types';

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
  { id: 'admins', name: 'Admins', description: 'Administrator with full system access', groupType: 'admin', permissions: ['*'], userCount: 2 },
  { id: 'tech_users', name: 'Tech Users', description: 'General network operations staff', groupType: 'tech_users', permissions: ['onu.view_configured', 'onu.authorize'], userCount: 12 },
  { id: 'readonly_users', name: 'Readonly Users', description: 'Read-only users with no right to make changes', groupType: 'read_only', permissions: ['onu.view'], userCount: 5 },
  { id: 'call_center', name: 'Call Center', description: 'Read-only user with rights to reboot and resync ONUs', groupType: 'support', permissions: ['onu.view', 'onu.reboot', 'onu.resync'], userCount: 8 },
  { id: 'managers', name: 'Managers', description: 'Full rights except user management', groupType: 'admin', permissions: ['onu.*', 'olt.*'], userCount: 3 },
  { id: 'installers', name: 'Installers', description: 'Can authorize and manage only ONUs authorized by themselves', groupType: 'tech_users', permissions: ['onu.authorize.own'], userCount: 20 },
  { id: 'installers_time_limit', name: 'Installers (Time Limit)', description: 'Same as installers but limited to last X days', groupType: 'tech_users', permissions: ['onu.authorize.own.timed'], userCount: 15 }
];

const MOCK_RESTRICTIONS: RestrictionGroup[] = [
  { id: 'rg1', name: 'Ulianópolis', description: 'Access restricted to Ulianópolis cluster', allowedOlts: ['ULI - Jetz Internet'], allowedZones: ['CEO 001'], allowedActions: ['view'], readOnly: true, userCount: 1 },
  { id: 'rg2', name: 'Paragominas North', description: 'Focus on northern sector zones', allowedOlts: ['PGM - Jetz Internet'], allowedZones: ['CEO 009', 'CEO 092'], allowedActions: ['view', 'authorize'], readOnly: false, userCount: 0 }
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

  async createUser(payload: UserCreationPayload): Promise<User> {
    console.log('🚀 Audit Log: User Creation Triggered', {
      actor: 'Current Admin',
      target: payload.email,
      groups: payload.groups,
      restrictions: payload.restrictionGroupId,
      permissions: payload.permissions
    });
    
    await new Promise(r => setTimeout(r, 1200));
    
    const newUser: User = {
      id: `u_${Math.random().toString(36).substr(2, 9)}`,
      name: `${payload.firstName} ${payload.lastName}`,
      ...payload,
      status: 'active' as const
    };

    return newUser;
  },

  async deleteUser(id: string): Promise<void> {
    console.log('API DELETE /users/' + id);
    await new Promise(r => setTimeout(r, 800));
  },

  async createGroup(payload: Omit<UserGroup, 'id' | 'userCount'>): Promise<UserGroup> {
    console.log('🚀 Audit Log: Group Creation Triggered', payload);
    await new Promise(r => setTimeout(r, 1000));
    const newGroup: UserGroup = {
      id: `g_${Math.random().toString(36).substr(2, 9)}`,
      userCount: 0,
      ...payload
    };
    return newGroup;
  }
};
