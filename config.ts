
/**
 * NoriOLT Configuration
 * Handles environment-based variables and system limits.
 */
export const CONFIG = {
  API_BASE_URL: process.env.API_BASE_URL || 'https://api.noriolt.com/api/v1',
  SOCKET_URL: process.env.SOCKET_URL || 'wss://socket.noriolt.com',
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
