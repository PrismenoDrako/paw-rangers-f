import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';
import { NotificationsHttpService, Notification } from './notifications-http.service';

export type { Notification };

@Injectable({
  providedIn: 'root'
})
export class NotificationWebsocketService {
  private socket: Socket | null = null;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private isConnectedSubject = new BehaviorSubject<boolean>(false);
  public isConnected$ = this.isConnectedSubject.asObservable();

  // Nuevo: emisor de notificaciones en tiempo real para mostrar toasts
  private notificationReceivedSubject = new Subject<Notification>();
  public notificationReceived$ = this.notificationReceivedSubject.asObservable();

  private readonly socketUrl = 'http://localhost:3000';

  constructor(
    private authService: AuthService,
    private notificationsHttpService: NotificationsHttpService
  ) {}

  /**
   * Conecta al servidor WebSocket
   */
  public connect(): void {
    if (this.socket?.connected) {
      console.log('✅ WebSocket ya está conectado');
      return;
    }

    // Si el usuario no está autenticado, no intentar conectar
    if (!this.authService.isAuthenticated()) {
      console.warn('❌ Usuario no autenticado - No se puede conectar al WebSocket');
      return;
    }

    console.log('🔌 Conectando al WebSocket de notificaciones...');

    // Cargar notificaciones guardadas del servidor al conectar
    this.loadSavedNotifications();

    // Conectar con credenciales (cookies HTTP-only)
    // El backend busca el token en: Authorization header, handshake.access_token, auth.token, o cookies
    this.socket = io(this.socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      withCredentials: true  // ✅ Enviar cookies automáticamente (incluye access_token)
    });

    this.socket.on('connect', () => {
      console.log('✅ Conectado al WebSocket');
      this.isConnectedSubject.next(true);
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('❌ Desconectado del WebSocket:', reason);
      this.isConnectedSubject.next(false);
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('⚠️ Error en WebSocket:', error);
    });

    this.socket.on('notification', (notification: Notification) => {
      console.log('📬 Nueva notificación vía WebSocket:', notification);
      console.log('🎯 [SOCKET CLIENT] Evento notification recibido');
      console.log('📦 [SOCKET CLIENT] Datos:', JSON.stringify(notification));
      
      this.addNotification(notification);
      // Emitir para que el toast la muestre en tiempo real
      this.notificationReceivedSubject.next(notification);
      
      console.log('✅ [SOCKET CLIENT] Notificación añadida y emitida al handler');
    });
  }

  /**
   * Desconecta del WebSocket
   */
  public disconnect(): void {
    if (this.socket) {
      console.log('🔌 Desconectando del WebSocket...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnectedSubject.next(false);
    }
  }

  /**
   * Carga las notificaciones guardadas desde el servidor
   */
  private loadSavedNotifications(): void {
    this.notificationsHttpService.getNotifications(1, 50).subscribe({
      next: (response) => {
        console.log('📥 Notificaciones cargadas del servidor:', response);
        // El backend retorna { status, data: { data, total, page, size, totalPages }, timestamp }
        const notificationsData = response.data.data || [];
        const notifications = Array.isArray(notificationsData) ? notificationsData : [];
        console.log('📥 Notificaciones procesadas:', notifications);
        this.notificationsSubject.next(notifications);
      },
      error: (err) => {
        console.error('⚠️ Error al cargar notificaciones:', err);
      }
    });
  }

  /**
   * Obtiene las notificaciones actuales
   */
  public getNotifications(): Notification[] {
    return this.notificationsSubject.value;
  }

  /**
   * Agrega una nueva notificación
   */
  private addNotification(notification: Notification): void {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([notification, ...current]);
  }

  /**
   * Limpia todas las notificaciones locales
   */
  public clearAll(): void {
    this.notificationsSubject.next([]);
  }

  /**
   * Marca una notificación como leída
   */
  public markAsRead(notificationId: string | number): void {
    // Si es un número, hacer request al servidor
    if (typeof notificationId === 'number') {
      this.notificationsHttpService.markAsRead(notificationId).subscribe({
        next: () => {
          console.log(`✅ Notificación ${notificationId} marcada como leída`);
          // Actualizar localmente
          const notifications = this.notificationsSubject.value;
          const notification = notifications.find(n => String(n.id) === String(notificationId));
          if (notification) {
            notification.read = true;
            notification.isRead = true;
            this.notificationsSubject.next([...notifications]);
          }
        },
        error: (err) => {
          console.error(`❌ Error al marcar como leída:`, err);
        }
      });
    } else {
      // Si es string, solo actualizar localmente
      const notifications = this.notificationsSubject.value;
      const notification = notifications.find(n => String(n.id) === String(notificationId));
      if (notification) {
        notification.read = true;
        notification.isRead = true;
        this.notificationsSubject.next([...notifications]);
      }
    }
  }
}


