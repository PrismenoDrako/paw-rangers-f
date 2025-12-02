import { Routes } from '@angular/router';
import { lostPetsRoutes } from './features/lost-pets/lost-pets.routes';
import { foundPetsRoutes } from './features/found-pets/found-pets.routes';
import { profileRoutes } from './features/profile/profile.routes';
import { homeRoutes } from './features/home/home.routes';

import { notificationsRoutes } from './features/notifications/notifications.routes';
export const routes: Routes = [
    // Ruta de inicio (página principal)
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },

    // Rutas de home
    ...homeRoutes,

    // Rutas de animales perdidos
    ...lostPetsRoutes,
    
    // Rutas de animales encontrados
    {
        path: 'animales-encontrados',
        children: foundPetsRoutes
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
