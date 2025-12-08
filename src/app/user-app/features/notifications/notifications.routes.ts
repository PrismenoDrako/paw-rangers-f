import { Routes } from '@angular/router';
import { NotificationsComponent } from './pages/notifications'; // Ruta al componente de notificaciones
import { NotificationSettingsComponent } from './components/notification-settings/notification-settings'; // Ruta al componente de configuración

export const notificationsRoutes: Routes = [
  { path: 'notificaciones', component: NotificationsComponent }, // Ruta para las notificaciones
  { path: 'notification-settings', component: NotificationSettingsComponent }  // Ruta para la configuración de notificaciones
];
