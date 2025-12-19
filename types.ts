
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

// Added OLT interface for dashboard lists and panels
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

export interface OnuSignalData {
  rx_power: number; // dBm
  tx_power: number; // dBm
  temp: number;
  voltage: number;
  bias_current: number;
}

// Updated ONU interface to include properties used in mock data and components
export interface ONU {
  id: string;
  sn: string;
  name: string;
  olt_id?: string;
  olt_name?: string;
  olt?: string; // used in mockData/components
  board?: number;
  port?: number;
  onu_index?: number;
  pon_path?: string; // e.g. 0/1/2
  pon?: string; // used in mockData/components
  zone?: string; // used in mockData/components
  odb?: string; // used in mockData
  vlan: number;
  mode: OnuMode;
  status: OnuStatus;
  signal: number;
  type?: string; // used in mockData/components
  authDate?: string; // used in mockData/components
  last_online?: string;
  last_offline?: string;
  firmware_version?: string;
  distance?: number; // km
}

// --- Alarm & Event Types ---
export type Severity = 'critical' | 'major' | 'minor' | 'info';

export interface SystemAlarm {
  id: string;
  severity: Severity;
  source_id: string; // OltID or OnuID
  source_type: 'OLT' | 'ONU' | 'SYSTEM';
  code: string;
  message: string;
  timestamp: string;
  is_acknowledged: boolean;
}

// Added ActivityEvent for system and network logging
export interface ActivityEvent {
  id: string;
  message: string;
  timestamp: string;
  type: 'error' | 'warning' | 'success' | 'info';
}

// --- Provisioning Payload ---
export interface ProvisioningTask {
  sn: string;
  name: string;
  olt_id: string;
  board: number;
  port: number;
  vlan: number;
  mode: OnuMode;
  profile_id: string;
}

// Added OnuProvisionPayload for the provisioning form component
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

// --- Dashboard Summary Types ---
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

// Added PONOutage for tracking network incidents
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

// --- Application View States ---
export type ViewType = 'dashboard' | 'unconfigured' | 'configured' | 'graphs' | 'diagnostics' | 'provisioning';
