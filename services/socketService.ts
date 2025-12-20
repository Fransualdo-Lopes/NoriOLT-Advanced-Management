
import { CONFIG } from '../config';
import { UnconfiguredONU } from '../types';

/**
 * Event-Driven WebSocket Client for NoriOLT
 * Handles real-time hardware detection events from OLT clusters.
 * Includes a simulation fallback for demo/development environments.
 */

export type SocketEventType = 'onu.detected' | 'onu.authorized' | 'onu.removed' | 'system.alert';
export type SocketStatus = 'connected' | 'disconnected' | 'connecting' | 'simulated';

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
  private simulationTimer: number | null = null;
  private statusListeners: Set<(status: SocketStatus) => void> = new Set();
  private currentStatus: SocketStatus = 'disconnected';

  constructor() {
    this.connect();
  }

  private connect() {
    if (this.socket) return;

    this.notifyStatus('connecting');
    
    try {
      this.socket = new WebSocket(CONFIG.SOCKET_URL);

      this.socket.onopen = () => {
        console.log('✅ Real-time Link established with NoriCore Cluster');
        this.stopSimulation();
        this.notifyStatus('connected');
        if (this.reconnectTimer) {
          clearInterval(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };

      this.socket.onmessage = (event) => {
        try {
          const message: SocketMessage = JSON.parse(event.data);
          this.emit(message.event, message.payload);
        } catch (err) {
          console.error('❌ Malformed Socket Message:', err);
        }
      };

      this.socket.onclose = () => {
        this.socket = null;
        this.notifyStatus('disconnected');
        this.startSimulation(); // Fallback to simulation for demo purposes
        
        if (!this.reconnectTimer) {
          this.reconnectTimer = window.setInterval(() => this.connect(), 15000);
        }
      };

      this.socket.onerror = () => {
        // WebSocket error events don't provide much info in the 'err' object
        // so we log a cleaner message and let onclose handle the logic.
        console.warn(`⚠️ Real-time Link at ${CONFIG.SOCKET_URL} unreachable. Engaging Simulation Mode...`);
        if (this.socket) this.socket.close();
      };
    } catch (e) {
      console.error('❌ Socket Initialization Failed:', e);
      this.startSimulation();
    }
  }

  private emit(event: SocketEventType, payload: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(payload));
    }
  }

  private notifyStatus(status: SocketStatus) {
    this.currentStatus = status;
    this.statusListeners.forEach(l => l(status));
  }

  /**
   * Simulation Mode Logic
   * To showcase the real-time UI features even without a backend.
   */
  private startSimulation() {
    if (this.simulationTimer || this.currentStatus === 'connected') return;
    
    this.notifyStatus('simulated');
    console.log('📡 NoriEngine: Real-time simulation active.');

    this.simulationTimer = window.setInterval(() => {
      // 30% chance of a random event
      const rand = Math.random();
      if (rand < 0.15) {
        // Mock new detection
        const mockOnu: UnconfiguredONU = {
          id: `sim_${Math.random().toString(36).substr(2, 5)}`,
          sn: `HWTC${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
          pon_type: 'GPON',
          board: 0,
          port: Math.floor(Math.random() * 16),
          pon_description: 'GPON 0/Sim',
          model: 'EG8145X6',
          olt_id: '1',
          olt_name: 'SIM - Virtual OLT',
          supports_immediate_auth: true
        };
        this.emit('onu.detected', mockOnu);
      }
    }, 15000); // Check every 15 seconds
  }

  private stopSimulation() {
    if (this.simulationTimer) {
      clearInterval(this.simulationTimer);
      this.simulationTimer = null;
    }
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

  onStatusChange(callback: (status: SocketStatus) => void) {
    this.statusListeners.add(callback);
    callback(this.currentStatus);
    return () => this.statusListeners.delete(callback);
  }

  isConnected() {
    return this.currentStatus === 'connected' || this.currentStatus === 'simulated';
  }
}

export const socketService = new SocketService();
