import { Routes } from '@angular/router';
import { lostPetsRoutes } from './features/lost-pets/lost-pets.routes';
import { foundPetsRoutes } from './features/found-pets/found-pets.routes';
import { profileRoutes } from './features/profile/profile.routes';

export const routes: Routes = [
    // Ruta de inicio (página principal)
    {
        path: '',
        redirectTo: '/lost-pets',
        pathMatch: 'full'
    },

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
    
];
