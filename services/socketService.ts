
import { CONFIG } from '../config';
import { SystemAlarm } from '../types';

type MessageHandler = (data: any) => void;

/**
 * Socket Service
 * Handles real-time communication for network alarms and OLT events.
 */
class SocketService {
  private socket: WebSocket | null = null;
  private handlers: Set<MessageHandler> = new Set();

  connect() {
    if (this.socket) return;

    this.socket = new WebSocket(CONFIG.SOCKET_URL);

    this.socket.onopen = () => {
      console.log('Connected to NoriOLT Event Stream');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handlers.forEach(handler => handler(data));
    };

    this.socket.onclose = () => {
      this.socket = null;
      console.log('Socket disconnected. Retrying in 5s...');
      setTimeout(() => this.connect(), 5000);
    };
  }

  subscribe(handler: MessageHandler) {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  send(topic: string, message: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ topic, ...message }));
    }
  }
}

export const socketService = new SocketService();
