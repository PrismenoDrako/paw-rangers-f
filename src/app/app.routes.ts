import { Routes } from '@angular/router';
import { lostPetsRoutes } from './features/lost-pets/lost-pets.routes';
import { profileRoutes } from './features/profile/profile.routes';
import { notificationsRoutes } from './features/notifications/notifications.routes';
export const routes: Routes = [
    ...lostPetsRoutes,
    ...profileRoutes,
    ...notificationsRoutes
];
