
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
  authDate?: string;
  mgmt_ip?: string;
  tr069?: string;
  download?: string;
  upload?: string;
}

// Added missing SummaryStats interface for dashboard
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

// Added missing ActivityEvent interface for logs
export interface ActivityEvent {
  id: string;
  message: string;
  timestamp: string;
  type: 'error' | 'success' | 'info' | 'warning';
}

// Added missing PONOutage interface for incidents
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

// Added missing UnconfiguredONU interface for pending authorizations
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

// Added missing ProvisioningPreset interface for configuration templates
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

// Added missing AuthCredentials interface
export interface AuthCredentials {
  username: string;
  password?: string;
}

// Added missing AuthResponse interface
export interface AuthResponse {
  token: string;
  user: User;
}

// Added missing User interface for Auth
export interface User {
  id: string;
  username: string;
  role: string;
  level: string;
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

export type ViewType = 'dashboard' | 'unconfigured' | 'configured' | 'graphs' | 'diagnostics' | 'provisioning' | 'presets';
