
import { SystemSettings, ConfigHistoryEntry } from '../types';

/**
 * Settings Service
 * Manages global system parameters and configuration history.
 */

let MOCK_SETTINGS: SystemSettings = {
  title: 'JETZ INTERNET',
  timezone: 'America/Belem',
  allowedIps: 'Allowed from anywhere',
  installerTimeLimitDays: 5,
  defaultLanguage: 'English'
};

const MOCK_HISTORY: ConfigHistoryEntry[] = [
  {
    id: 'h1',
    userId: 'u1',
    userName: 'marcos',
    timestamp: '2025-12-15 10:20:45',
    changes: [
      { field: 'title', oldValue: 'JETZ OLT', newValue: 'JETZ INTERNET' }
    ]
  },
  {
    id: 'h2',
    userId: 'u2',
    userName: 'suporte',
    timestamp: '2025-11-20 14:15:22',
    changes: [
      { field: 'installerTimeLimitDays', oldValue: 10, newValue: 5 }
    ]
  }
];

export const settingsService = {
  async getSettings(): Promise<SystemSettings> {
    await new Promise(r => setTimeout(r, 300));
    const saved = localStorage.getItem('nori_system_settings');
    return saved ? JSON.parse(saved) : MOCK_SETTINGS;
  },

  async updateSettings(settings: SystemSettings): Promise<SystemSettings> {
    console.log('🚀 Audit Log: Global Settings Updated', settings);
    await new Promise(r => setTimeout(r, 1000));
    localStorage.setItem('nori_system_settings', JSON.stringify(settings));
    MOCK_SETTINGS = settings;
    return settings;
  },

  async getHistory(): Promise<ConfigHistoryEntry[]> {
    await new Promise(r => setTimeout(r, 400));
    return MOCK_HISTORY;
  }
};
