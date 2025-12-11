import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationWebsocketService, Notification } from './notification-websocket.service';
import { ToastService } from './toast.service';

/**
 * Servicio para manejar la lógica de notificaciones en tiempo real
 * Mapea los tipos de notificaciones y muestra toasts con acciones apropiadas
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationHandlerService {

  constructor(
    private notificationWs: NotificationWebsocketService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.initializeNotificationHandler();
  }

  /**
   * Inicializa el manejador de notificaciones
   * Se suscribe a nuevas notificaciones del WebSocket
   */
  private initializeNotificationHandler(): void {
    this.notificationWs.notificationReceived$.subscribe(notification => {
      this.handleNotification(notification);
    });
  }

  /**
   * Maneja una notificación según su tipo
   */
  private handleNotification(notification: Notification): void {
    console.log('🔔 Manejando notificación:', notification);

    // Mapear por tipo de notificación (si existe)
    // El backend puede enviar tipos diferentes: alert, message, system, etc.
    
    // Intentar detectar el tipo por el título o mensaje
    const title = notification.title || 'Notificación';
    const message = notification.message || '';
    
    // Detectar si es una alerta de mascota cercana
    if (this.isNearbyPetAlert(notification)) {
      this.showNearbyPetAlert(notification);
    }
    // Detectar si es una alerta general
    else if (this.isAlert(notification)) {
      this.showAlert(notification);
    }
    // Mensaje normal
    else {
      this.showInfo(notification);
    }
  }

  /**
   * Verifica si la notificación es una alerta de mascota cercana
   */
  private isNearbyPetAlert(notification: Notification): boolean {
    const lowerTitle = (notification.title || '').toLowerCase();
    const lowerMessage = (notification.message || '').toLowerCase();
    
    return (
      lowerTitle.includes('alerta') || 
      lowerTitle.includes('mascota') ||
      lowerTitle.includes('cerca') ||
      lowerMessage.includes('mascota perdida') ||
      lowerMessage.includes('mascota encontrada') ||
      lowerMessage.includes('cercan')
    );
  }

  /**
   * Verifica si es una alerta general
   */
  private isAlert(notification: Notification): boolean {
    const lowerTitle = (notification.title || '').toLowerCase();
    return lowerTitle.includes('alerta') || lowerTitle.includes('advertencia');
  }

  /**
   * Muestra una alerta de mascota cercana
   */
  private showNearbyPetAlert(notification: Notification): void {
    const toastId = this.toastService.show({
      title: notification.title || '🐾 Mascota Cercana',
      message: notification.message || '',
      type: 'warning',
      duration: 0, // No auto-cerrar
      action: {
        label: 'Ver Detalles',
        callback: () => this.viewPetDetails(notification)
      },
      data: notification
    });

    console.log('📢 Toast de mascota cercana mostrado:', toastId);
  }

  /**
   * Muestra una alerta
   */
  private showAlert(notification: Notification): void {
    const toastId = this.toastService.show({
      title: notification.title || '⚠️ Alerta',
      message: notification.message || '',
      type: 'warning',
      duration: 7000,
      action: notification.url ? {
        label: 'Ver',
        callback: () => this.navigateToUrl(notification.url!)
      } : undefined,
      data: notification
    });

    console.log('⚠️ Toast de alerta mostrado:', toastId);
  }

  /**
   * Muestra una notificación de información
   */
  private showInfo(notification: Notification): void {
    const toastId = this.toastService.show({
      title: notification.title || 'ℹ️ Información',
      message: notification.message || '',
      type: 'info',
      duration: 5000,
      action: notification.url ? {
        label: 'Abrir',
        callback: () => this.navigateToUrl(notification.url!)
      } : undefined,
      data: notification
    });

    console.log('ℹ️ Toast de información mostrado:', toastId);
  }

  /**
   * Navega a los detalles de la mascota
   */
  private viewPetDetails(notification: Notification): void {
    console.log('🐾 Viendo detalles de mascota:', notification);
    
    // Si la notificación tiene una URL, usarla
    if (notification.url) {
      this.navigateToUrl(notification.url);
    } else {
      // Si no, intentar extraer el ID de la notificación
      // Ejemplo: si el mensaje contiene "mascotas/123" o similar
      console.warn('No hay URL en la notificación, no se puede navegar');
    }
  }

  /**
   * Navega a una URL
   */
  private navigateToUrl(url: string): void {
    if (url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      this.router.navigate([url]);
    }
  }
}
