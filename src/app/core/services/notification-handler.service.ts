import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NotificationWebsocketService, Notification } from './notification-websocket.service';
import { LocationService, UserLocation } from './location.service';

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
    private messageService: MessageService,
    private router: Router,
    private locationService: LocationService
  ) {
    console.log('🔔 NotificationHandlerService: Inicializando...');
    this.initializeNotificationHandler();
    // ✅ Conectar al WebSocket de notificaciones en tiempo real
    // Usar un pequeño delay para asegurar que la autenticación está lista
    setTimeout(() => {
      console.log('🔌 NotificationHandlerService: Llamando a connect()...');
      this.notificationWs.connect();
    }, 500);
  }

  /**
   * Inicializa el manejador de notificaciones
   * Se suscribe a nuevas notificaciones del WebSocket
   */
  private initializeNotificationHandler(): void {
    console.log('🎯 initializeNotificationHandler: Suscribiéndose a notificaciones...');
    this.notificationWs.notificationReceived$.subscribe(notification => {
      console.log('🎯 initializeNotificationHandler: Notificación recibida del observable:', notification);
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
    console.log('🐾 showNearbyPetAlert: Obteniendo ubicaciones del usuario...');
    
    // Obtener ubicaciones del usuario para encontrar la más cercana
    this.locationService.getUserLocations().subscribe({
      next: (response: any) => {
        console.log('✅ showNearbyPetAlert: Respuesta completa:', response);
        
        // El backend retorna {status: 'success', data: [...], timestamp: '...'}
        // Necesitamos extraer el array de locations de response.data
        const locations = response.data || response;
        console.log('✅ showNearbyPetAlert: Ubicaciones extraídas:', locations);
        console.log('✅ showNearbyPetAlert: Cantidad de ubicaciones:', locations ? locations.length : 0);
        
        let locationName = 'tu ubicación guardada';
        
        if (locations && Array.isArray(locations) && locations.length > 0) {
          locationName = locations[0].name;
          console.log('📍 showNearbyPetAlert: Nombre de ubicación:', locationName);
        } else {
          console.log('⚠️ showNearbyPetAlert: No hay ubicaciones disponibles o no es un array');
        }
        
        const formattedMessage = `Se perdió una mascota cerca a ${locationName}`;
        console.log('📝 showNearbyPetAlert: Mensaje formateado:', formattedMessage);
        
        // Usar PrimeNG MessageService para mostrar un toast más grande
        this.messageService.add({
          severity: 'info',
          summary: notification.title || '🐾 Mascota Cercana',
          detail: formattedMessage,
          life: 0, // No auto-cerrar
          sticky: true, // Sticky para que no desaparezca
          styleClass: 'notification-toast-large',
          contentStyleClass: 'notification-toast-content'
        });

        console.log('📢 Toast de mascota cercana mostrado (PrimeNG)');
      },
      error: (err) => {
        console.error('❌ Error al obtener ubicaciones:', err);
        // Fallback si hay error
        const formattedMessage = `Se perdió una mascota cerca a tu ubicación guardada`;
        
        this.messageService.add({
          severity: 'info',
          summary: notification.title || '🐾 Mascota Cercana',
          detail: formattedMessage,
          life: 0,
          sticky: true,
          styleClass: 'notification-toast-large',
          contentStyleClass: 'notification-toast-content'
        });

        console.log('📢 Toast de mascota cercana mostrado (fallback PrimeNG)');
      }
    });
  }

  /**
   * Muestra una alerta
   */
  private showAlert(notification: Notification): void {
    this.messageService.add({
      severity: 'warn',
      summary: notification.title || '⚠️ Alerta',
      detail: notification.message || '',
      life: 7000,
      sticky: false,
      styleClass: 'notification-toast-large'
    });

    console.log('⚠️ Toast de alerta mostrado (PrimeNG)');
  }

  /**
   * Muestra una notificación de información
   */
  private showInfo(notification: Notification): void {
    this.messageService.add({
      severity: 'info',
      summary: notification.title || 'ℹ️ Información',
      detail: notification.message || '',
      life: 5000,
      sticky: false,
      styleClass: 'notification-toast-large'
    });

    console.log('ℹ️ Toast de información mostrado (PrimeNG)');
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
