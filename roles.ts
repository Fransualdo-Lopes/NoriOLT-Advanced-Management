
/**
 * NoriOLT Permission Matrix
 * Defines granular access control for ISP operations.
 */

export type UserRole = 'ADMIN' | 'NOC' | 'SUPPORT';

export enum Permission {
  // ONU Permissions
  VIEW_CONFIGURED = 'onu.view_configured',
  VIEW_UNCONFIGURED = 'onu.view_unconfigured',
  AUTHORIZE_ONU = 'onu.authorize',
  PROVISION_ONU = 'onu.provision',
  REBOOT_ONU = 'onu.reboot',
  DELETE_ONU = 'onu.delete',
  
  // Network/OLT Permissions
  VIEW_OLT_STATS = 'olt.view_stats',
  MANAGE_OLT = 'olt.manage',
  
  // User & Management Permissions
  VIEW_USERS = 'settings.view_users',
  MANAGE_USERS = 'settings.manage_users',
  VIEW_GROUPS = 'settings.view_groups',
  MANAGE_GROUPS = 'settings.manage_groups',
  VIEW_RESTRICTIONS = 'settings.view_restrictions',
  MANAGE_RESTRICTIONS = 'settings.manage_restrictions',
  VIEW_AUDIT_LOGS = 'settings.view_audit',
  
  // System Permissions
  VIEW_LOGS = 'system.view_logs',
  MANAGE_USERS_SYSTEM = 'system.manage_users', // Legacy mapping
  SYSTEM_SETTINGS = 'system.settings'
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    Permission.VIEW_CONFIGURED,
    Permission.VIEW_UNCONFIGURED,
    Permission.AUTHORIZE_ONU,
    Permission.PROVISION_ONU,
    Permission.REBOOT_ONU,
    Permission.DELETE_ONU,
    Permission.VIEW_OLT_STATS,
    Permission.MANAGE_OLT,
    Permission.VIEW_USERS,
    Permission.MANAGE_USERS,
    Permission.VIEW_GROUPS,
    Permission.MANAGE_GROUPS,
    Permission.VIEW_RESTRICTIONS,
    Permission.MANAGE_RESTRICTIONS,
    Permission.VIEW_AUDIT_LOGS,
    Permission.VIEW_LOGS,
    Permission.SYSTEM_SETTINGS
  ],
  NOC: [
    Permission.VIEW_CONFIGURED,
    Permission.VIEW_UNCONFIGURED,
    Permission.AUTHORIZE_ONU,
    Permission.PROVISION_ONU,
    Permission.REBOOT_ONU,
    Permission.VIEW_OLT_STATS,
    Permission.VIEW_USERS,
    Permission.VIEW_GROUPS,
    Permission.VIEW_AUDIT_LOGS,
    Permission.VIEW_LOGS
  ],
  SUPPORT: [
    Permission.VIEW_CONFIGURED,
    Permission.VIEW_OLT_STATS
  ]
};
