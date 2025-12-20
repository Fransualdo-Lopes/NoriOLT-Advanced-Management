
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
  
  // System Permissions
  VIEW_LOGS = 'system.view_logs',
  MANAGE_USERS = 'system.manage_users',
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
    Permission.VIEW_LOGS,
    Permission.MANAGE_USERS,
    Permission.SYSTEM_SETTINGS
  ],
  NOC: [
    Permission.VIEW_CONFIGURED,
    Permission.VIEW_UNCONFIGURED,
    Permission.AUTHORIZE_ONU,
    Permission.PROVISION_ONU, // NOC can provision
    Permission.REBOOT_ONU,
    Permission.VIEW_OLT_STATS,
    Permission.VIEW_LOGS
  ],
  SUPPORT: [
    Permission.VIEW_CONFIGURED,
    Permission.VIEW_OLT_STATS
    // Support is strictly read-only for diagnostics and current inventory
  ]
};

/**
 * Example JWT Payload (Decoded)
 * {
 *   "sub": "u123",
 *   "name": "Operator Name",
 *   "role": "NOC",
 *   "iat": 1715600000,
 *   "exp": 1715686400
 * }
 */
