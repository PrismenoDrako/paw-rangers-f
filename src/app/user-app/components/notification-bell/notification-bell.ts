import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationWebsocketService, Notification } from '../../../core/services/notification-websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-bell.html',
  styleUrl: './notification-bell.scss'
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  showNotifications = false;
  private subscription: Subscription | null = null;

  constructor(
    private notificationService: NotificationWebsocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Conectar al WebSocket cuando el componente se inicializa
    console.log('🔔 NotificationBellComponent inicializado - Conectando WebSocket');
    this.notificationService.connect();

    // Suscribirse a las notificaciones
    this.subscription = this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
      // Contar las notificaciones no leídas (soportar tanto 'read' como 'isRead')
      this.unreadCount = notifications.filter(n => !(n.read || n.isRead)).length;
      console.log(`📢 Notificaciones actualizadas: ${this.notifications.length} total, ${this.unreadCount} sin leer`);
    });
  }

  ngOnDestroy(): void {
    // Desuscribirse cuando el componente se destruye
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    // Navegar a la página de notificaciones
    this.router.navigate(['/app/notificaciones']);
  }

  markAsRead(notification: Notification): void {
    this.notificationService.markAsRead(notification.id);
  }

  clearAll(): void {
    this.notificationService.clearAll();
    this.showNotifications = false;
  }

  getNotificationIcon(type: string | undefined): string {
    const icons: { [key: string]: string } = {
      'lost_pet_alert': 'pi-exclamation-circle',
      'found_pet_alert': 'pi-check-circle',
      'pet_update': 'pi-info-circle',
      'system': 'pi-bell'
    };
    return icons[type || 'system'] || 'pi-bell';
  }
}

