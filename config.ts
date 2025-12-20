
/**
 * NoriOLT Configuration
 * Handles environment-based variables and system limits.
 */

// Helper to safely get environment variables in Vite/Browser environments
const getEnv = (key: string, fallback: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  // Vite specific environment variables (VITE_ prefix)
  const viteKey = `VITE_${key}`;
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[viteKey]) {
    return (import.meta as any).env[viteKey];
  }
  return fallback;
};

export const CONFIG = {
  API_BASE_URL: getEnv('API_BASE_URL', 'https://api.noriolt.com/api/v1'),
  SOCKET_URL: getEnv('SOCKET_URL', 'wss://socket.noriolt.com'),
  REFRESH_INTERVALS: {
    DASHBOARD: 30000, // 30s
    TELEMETRY: 5000,   // 5s for critical diagnostics
    LOGS: 10000        // 10s
  },
  THRESHOLDS: {
    SIGNAL_CRITICAL: -27,
    SIGNAL_WARNING: -24,
    TEMP_CRITICAL: 50
  }
};