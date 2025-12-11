import { Routes } from '@angular/router';
import { AppLayout } from './app-layout/app-layout';
import { homeRoutes } from './features/home/home.routes';
import { lostPetsRoutes } from './features/lost-pets/lost-pets.routes';
import { foundPetsRoutes } from './features/found-pets/found-pets.routes';
import { mapExplorerRoutes } from './features/map-explorer/map-explorer.routes';
import { alertsRoutes } from './features/alerts/alerts.routes';
import { notificationsRoutes } from './features/notifications/notifications.routes';
import { profileRoutes } from './features/profile/profile.routes';

export const UserAppRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            // Cargar home directamente en /app (sin /app/home)
            ...homeRoutes.map(route => ({ ...route, path: route.path === 'home' ? '' : route.path })),
            ...lostPetsRoutes,
            { path: 'animales-encontrados', children: foundPetsRoutes },
            ...mapExplorerRoutes,
            { path: 'alertas', children: alertsRoutes },
            ...notificationsRoutes,
            ...profileRoutes,
        ]
    },
];
