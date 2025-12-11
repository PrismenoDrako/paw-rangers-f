import { Injectable, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | null = null;
  private readonly messageService = inject(MessageService);
  private readonly socketUrl = 'http://localhost:3000';

  /**
   * Conecta al socket del servidor
   */
  connect(): void {
    if (this.socket?.connected) {
      return; // Ya está conectado
    }

    this.socket = io(this.socketUrl, {
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.setupEventListeners();
  }

  /**
   * Configura los listeners para los eventos del socket
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Evento: conexión exitosa
    this.socket.on('connect', () => {
      console.log('✅ Conectado al servidor Socket.io');
    });

    // Evento: desconexión
    this.socket.on('disconnect', () => {
      console.log('❌ Desconectado del servidor Socket.io');
    });

    // Evento: pong (heartbeat para verificar conexión)
    this.socket.on('pong', () => {
      console.log('🏓 Pong recibido del servidor');
    });

    // Evento: notificación
    this.socket.on('notification', (data: any) => {
      console.log('📬 Notificación recibida:', data);
      this.showNotification(data);
    });

    // Evento: error de conexión
    this.socket.on('connect_error', (error: any) => {
      console.error('🚨 Error de conexión Socket.io:', error);
    });
  }

  /**
   * Muestra una notificación tipo toast
   */
  private showNotification(data: any): void {
    const message = data?.message || 'Nueva notificación';
    const severity = data?.severity || 'info'; // info, success, warn, error

    this.messageService.add({
      severity,
      summary: data?.title || 'Notificación',
      detail: message,
      life: 5000, // Dura 5 segundos
      sticky: false,
    });
  }

  /**
   * Desconecta del socket
   */
  disconnect(): void {
    if (this.socket?.connected) {
      this.socket.disconnect();
      this.socket = null;
      console.log('Desconectado del Socket.io');
    }
  }

  /**
   * Verifica si está conectado
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Emite un evento al servidor
   */
  emit(eventName: string, data?: any): void {
    if (this.socket?.connected) {
      this.socket.emit(eventName, data);
    }
  }
}
