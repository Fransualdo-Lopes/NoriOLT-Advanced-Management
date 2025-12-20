
import { CONFIG } from '../config';
import { UnconfiguredONU } from '../types';

/**
 * Event-Driven WebSocket Client for NoriOLT
 * Handles real-time hardware detection events from OLT clusters.
 */

export type SocketEventType = 'onu.detected' | 'onu.authorized' | 'onu.removed' | 'system.alert';

export interface SocketMessage<T = any> {
  event: SocketEventType;
  payload: T;
  timestamp: string;
}

type EventCallback<T = any> = (payload: T) => void;

class SocketService {
  private socket: WebSocket | null = null;
  private listeners: Map<SocketEventType, Set<EventCallback>> = new Map();
  private reconnectTimer: number | null = null;
  private statusListeners: Set<(status: 'connected' | 'disconnected' | 'connecting') => void> = new Set();

  constructor() {
    this.connect();
  }

  private connect() {
    if (this.socket) return;

    this.notifyStatus('connecting');
    this.socket = new WebSocket(CONFIG.SOCKET_URL);

    this.socket.onopen = () => {
      console.log('✅ Real-time Link established with NoriCore Cluster');
      this.notifyStatus('connected');
      if (this.reconnectTimer) {
        clearInterval(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    };

    this.socket.onmessage = (event) => {
      try {
        const message: SocketMessage = JSON.parse(event.data);
        const eventListeners = this.listeners.get(message.event);
        if (eventListeners) {
          eventListeners.forEach(callback => callback(message.payload));
        }
      } catch (err) {
        console.error('❌ Malformed Socket Message:', err);
      }
    };

    this.socket.onclose = () => {
      this.socket = null;
      this.notifyStatus('disconnected');
      console.warn('⚠️ Socket disconnected. Retrying precision link in 5s...');
      if (!this.reconnectTimer) {
        this.reconnectTimer = window.setInterval(() => this.connect(), 5000);
      }
    };

    this.socket.onerror = (err) => {
      console.error('❌ Socket Link Error:', err);
    };
  }

  private notifyStatus(status: 'connected' | 'disconnected' | 'connecting') {
    this.statusListeners.forEach(l => l(status));
  }

  /**
   * High-level subscription for hardware events
   */
  on<T>(event: SocketEventType, callback: EventCallback<T>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
    
    // Return unsubscribe function
    return () => this.listeners.get(event)?.delete(callback);
  }

  onStatusChange(callback: (status: 'connected' | 'disconnected' | 'connecting') => void) {
    this.statusListeners.add(callback);
    return () => this.statusListeners.delete(callback);
  }

  isConnected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

export const socketService = new SocketService();
