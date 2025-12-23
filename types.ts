
/**
 * Core Domain Types for ISP/GPON Management
 */

// --- OLT Types ---
export type OltStatus = 'online' | 'offline' | 'maintenance';
export type Manufacturer = 'Huawei' | 'ZTE' | 'Nokia' | 'VSOL' | 'Datacom' | 'Dasan' | 'Furukawa' | 'Fiberhome';

export interface OLT {
  id: string;
  name: string;
  manufacturer?: Manufacturer;
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

export interface EthernetPort {
  id: string;
  label: string;
  status: 'Up' | 'Down';
  admin_status: 'Enabled' | 'Disabled';
  speed: string;
  mode: string;
}

export interface WifiSSID {
  id: string;
  name: string;
  frequency: '2.4GHz' | '5GHz';
  status: boolean;
  security: string;
  channel: number;
}

export interface ServicePort {
  id: string;
  svlan: number;
  cvlan: number;
  download: string;
  upload: string;
  status: string;
}

export interface OnuDetailed extends ONU {
  vendor: string;
  model: string;
  firmware: string;
  software_version: string;
  rx_power: number;
  tx_power: number;
  distance: number; // in meters
  temperature: number;
  voltage: number;
  frame: number;
  slot: number;
  port_id: number;
  pon_type: 'GPON' | 'EPON';
  ethernet_ports: EthernetPort[];
  wifi_ssids: WifiSSID[];
  service_ports: ServicePort[];
  voip_details?: {
    status: string;
    ip: string;
    uri: string;
  };
}

// --- Provisioning & Presets ---
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

export interface OnuProvisionPayload {
  olt_id: string;
  board: number;
  port: number;
  sn: string;
  name: string;
  mode: OnuMode;
  vlan: number;
  profile: string;
  preset_id?: string;
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
  description?: string;
  created_at: string;
  wifi_ssid_suffix?: string;
}

// --- User Management & RBAC ---
export type UserStatus = 'active' | 'disabled';
export type GroupType = 'admin' | 'tech_users' | 'read_only' | 'support';

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  phone?: string;
  username: string;
  role: string;
  groups: string[];
  restrictionGroupId?: string;
  status: UserStatus;
  level?: string;
  lastLogin?: string;
  allowedIps?: string[];
  language?: string;
  forcePasswordChange?: boolean;
}

// Added missing UserPermissions interface
export interface UserPermissions {
  viewDashboardStats: boolean;
  viewPaymentOptions: boolean;
  viewOnuCount: boolean;
  deleteOnus: boolean;
  batchOnuActions: boolean;
  receiveExpiringAlerts: boolean;
  receiveLoginIpAlerts: boolean;
}

// Added missing UserCreationPayload interface
export interface UserCreationPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  username: string;
  role: string;
  groups: string[];
  restrictionGroupId?: string;
  password?: string;
  confirmPassword?: string;
  language?: string;
  forcePasswordChange?: boolean;
  allowedIps?: string[];
  permissions?: UserPermissions;
}

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  groupType: GroupType;
  permissions: string[];
  userCount: number;
}

export interface RestrictionGroup {
  id: string;
  name: string;
  description: string;
  allowedOlts: string[];
  allowedZones: string[];
  allowedActions: string[];
  readOnly: boolean;
  userCount: number;
}

// Added missing Auth interfaces
export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// --- Network Stats & Events ---
export interface SummaryStats {
  waitingAuth: number;
  waitingSub: { d: number; resync: number; new: number };
  online: number;
  totalAuthorized: number;
  offline: number;
  offlineSub: { pwrFail: number; los: number; na: number };
  lowSignal: number;
  lowSignalSub: { warning: number; critical: number };
}

export interface ActivityEvent {
  id: string;
  message: string;
  timestamp: string;
  type: 'error' | 'success' | 'info' | 'warning';
}

// Added missing PONOutage interface
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

// Added missing ConfigChange interface
export interface ConfigChange {
  field: string;
  oldValue: any;
  newValue: any;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  olt?: {
    name: string;
    manufacturer: Manufacturer;
  };
  onu_sn?: string;
  user: {
    username: string;
    role: string;
  };
  ip: string;
  timestamp: string;
  status: 'success' | 'failure';
  errorMessage?: string;
  changes?: ConfigChange[]; // Added missing changes property
}

// Added missing AuditLog interface used in user management
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: string;
  ip: string;
  result: 'success' | 'failure';
}

// Added missing ConfigHistoryEntry interface
export interface ConfigHistoryEntry {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  changes: ConfigChange[];
}

// --- System Configuration ---
export interface SystemSettings {
  title: string;
  timezone: string;
  allowedIps: string;
  installerTimeLimitDays: number;
  defaultLanguage: string;
}

export type ViewType = 'dashboard' | 'unconfigured' | 'configured' | 'graphs' | 'diagnostics' | 'provisioning' | 'presets' | 'settings' | 'onu-details';
export type SettingsTab = 'general' | 'users' | 'apikey' | 'billing';
