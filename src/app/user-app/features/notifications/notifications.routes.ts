import { Routes } from '@angular/router';
import { NotificationsComponent } from './pages/notifications';
import { NotificationSettingsComponent } from './components/notification-settings/notification-settings';

export const notificationsRoutes: Routes = [
  { path: 'notifications', redirectTo: 'notificaciones', pathMatch: 'full' },
  { path: 'notificaciones', component: NotificationsComponent },
  { path: 'notification-settings', component: NotificationSettingsComponent },
];
