
/**
 * Core Domain Types for ISP/GPON Management
 */

// --- OLT Types ---
export type OltStatus = 'online' | 'offline' | 'maintenance';

export interface OLT {
  id: string;
  name: string;
  uptime: string;
  temperature: number;
  status: OltStatus;
}

// --- ONU Types ---
export type OnuStatus = 'online' | 'offline' | 'los' | 'dying-gasp' | 'unconfigured';
export type OnuMode = 'Bridge' | 'Router';

export interface ONU {
  id: string;
  sn: string;
  mac?: string;
  name: string;
  olt_id?: string;
  olt_name?: string;
  olt?: string;
  board?: number;
  port?: number;
  onu_index?: number;
  pon_path?: string;
  pon?: string;
  zone?: string;
  odb?: string;
  vlan: number;
  mode: OnuMode;
  status: OnuStatus;
  signal: number;
  voip?: boolean;
  tv?: boolean;
  type?: string;
  profile?: string;
  authDate?: string;
  lastSeen?: string;
  mgmt_ip?: string;
  tr069?: string;
  download?: string;
  upload?: string;
}

// --- User Management & RBAC ---
export type UserStatus = 'active' | 'disabled';
export type GroupType = 'admin' | 'tech_users' | 'read_only' | 'support';

export interface UserPermissions {
  viewDashboardStats: boolean;
  viewPaymentOptions: boolean;
  viewOnuCount: boolean;
  deleteOnus: boolean;
  batchOnuActions: boolean;
  receiveExpiringAlerts: boolean;
  receiveLoginIpAlerts: boolean;
}

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  phone?: string;
  username: string;
  role: string; // ADMIN | NOC | SUPPORT
  groups: string[];
  restrictionGroupId?: string;
  status: UserStatus;
  level?: string;
  lastLogin?: string;
  allowedIps?: string[];
  language?: string;
  forcePasswordChange?: boolean;
  permissions?: UserPermissions;
}

export interface UserCreationPayload extends Omit<User, 'id' | 'name' | 'status'> {
  password?: string;
  confirmPassword?: string;
}

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  groupType: GroupType;
  permissions: string[];
  userCount: number;
  createdAt?: string;
}

export interface RestrictionGroup {
  id: string;
  name: string;
  description?: string;
  allowedOlts: string[];
  allowedZones: string[];
  allowedActions: string[];
  readOnly: boolean;
  userCount: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: string;
  ip: string;
  result: 'success' | 'denied';
}

// --- Monitoring & Stats ---
export interface SummaryStats {
  waitingAuth: number;
  waitingSub: { d: number, resync: number, new: number };
  online: number;
  totalAuthorized: number;
  offline: number;
  offlineSub: { pwrFail: number, los: number, na: number };
  lowSignal: number;
  lowSignalSub: { warning: number, critical: number }
}

export interface ActivityEvent {
  id: string;
  message: string;
  timestamp: string;
  type: 'error' | 'success' | 'info' | 'warning';
}

export interface PONOutage {
  id: string;
  oltName: string;
  boardPort: string;
  onusAffected: number;
  los: number;
  power: number;
  cause: string;
  since: string;
}

export interface UnconfiguredONU {
  id: string;
  sn: string;
  pon_type: string;
  board: number;
  port: number;
  pon_description: string;
  model: string;
  olt_id: string;
  olt_name: string;
  supports_immediate_auth: boolean;
}

export interface ProvisioningPreset {
  id: string;
  name: string;
  onu_type: string;
  line_profile: string;
  service_profile: string;
  vlan: number;
  mode: OnuMode;
  pppoe_enabled: boolean;
  voip_enabled: boolean;
  tv_enabled: boolean;
  description: string;
  created_at: string;
  wifi_ssid_suffix?: string;
}

export interface AuthCredentials {
  username: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface OnuProvisionPayload {
  olt_id: string;
  board: number;
  port: number;
  sn: string;
  name: string;
  mode: string;
  vlan: number;
  profile: string;
}

export type ViewType = 'dashboard' | 'unconfigured' | 'configured' | 'graphs' | 'diagnostics' | 'provisioning' | 'presets' | 'settings';
export type SettingsTab = 'general' | 'users' | 'apikey' | 'billing';
