import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification-header',
  standalone: true,
  templateUrl: './notification-header.html',
  styleUrls: ['./notification-header.scss']
})
export class NotificationHeaderComponent {
  @Input() totalNotifications: number = 0; // Número total de notificaciones
}
