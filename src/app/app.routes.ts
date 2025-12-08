import { Routes } from '@angular/router';
import { lostPetsRoutes } from './features/lost-pets/lost-pets.routes';
import { foundPetsRoutes } from './features/found-pets/found-pets.routes';
import { profileRoutes } from './features/profile/profile.routes';
import { homeRoutes } from './features/home/home.routes';
import { alertsRoutes } from './features/alerts/alerts.routes';
import { mapExplorerRoutes } from './features/map-explorer/map-explorer.routes';

import { notificationsRoutes } from './features/notifications/notifications.routes';
export const routes: Routes = [
    // Ruta de inicio (página principal)
    {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('./public/public.routes').then(
            m => m.PublicRoutes
        )
    },
    {
        path: 'app',
        loadChildren: () => import('./user-app/user-app.routes').then(
            m => m.UserAppRoutes
        )
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin-panel/admin-panel.routes').then(
            m => m.AdminAppRoutes
        )
    },

    // Rutas de home
    ...homeRoutes,

    // Mapa explorador
    ...mapExplorerRoutes,

    // Rutas de animales perdidos
    ...lostPetsRoutes,
    
    // Rutas de animales encontrados
    {
        path: 'animales-encontrados',
        children: foundPetsRoutes
    },

    // Rutas de alertas
    {
        path: 'alertas',
        children: alertsRoutes
    },
    
    // Legacy route for found-pets (redirect to new URL)
    {
        path: 'found-pets',
        redirectTo: '/animales-encontrados',
        pathMatch: 'prefix'
    },
    
    // Rutas de perfil
    ...profileRoutes,
    ...notificationsRoutes
];
