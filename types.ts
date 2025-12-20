
/**
 * Core Domain Types for ISP/GPON Management
 */

// --- OLT Types ---
export type OltStatus = 'online' | 'offline' | 'maintenance';

export interface OltHardware {
  id: string;
  name: string;
  ip: string;
  vendor: 'Huawei' | 'ZTE' | 'Fiberhome' | 'Nokia';
  uptime: string;
  temperature: number;
  cpu_load: number;
  mem_usage: number;
  status: OltStatus;
  boards_count: number;
}

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

export interface UnconfiguredONU {
  id: string;
  sn: string;
  pon_type: 'GPON' | 'EPON' | 'XGS-PON';
  board: number;
  port: number;
  pon_description: string;
  model: string;
  olt_id: string;
  olt_name: string;
  supports_immediate_auth: boolean;
}

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
  type?: string;
  authDate?: string;
  last_online?: string;
  last_offline?: string;
  firmware_version?: string;
  distance?: number;
}

// --- Alarm & Event Types ---
export type Severity = 'critical' | 'major' | 'minor' | 'info';

export interface ActivityEvent {
  id: string;
  message: string;
  timestamp: string;
  type: 'error' | 'warning' | 'success' | 'info';
}

// --- Summary & Dashboard ---
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

export interface PONOutage {
  id: string;
  oltName: string;
  boardPort: string;
  onusAffected: number;
  since: string;
  cause: string;
  los: number;
  power: number;
}

// --- Auth Types ---
export interface User {
  id: string;
  username: string;
  role: string;
  level: string;
}

export interface AuthCredentials {
  username?: string;
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

export type ViewType = 'dashboard' | 'unconfigured' | 'configured' | 'graphs' | 'diagnostics' | 'provisioning';
