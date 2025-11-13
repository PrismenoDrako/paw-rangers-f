import { Routes } from '@angular/router';
import { lostPetsRoutes } from './features/lost-pets/lost-pets.routes';

export const routes: Routes = [
    // Ruta de inicio (página principal)
    { path: '', redirectTo: '/animales-perdidos', pathMatch: 'full' },
    { path: 'inicio', redirectTo: '/animales-perdidos', pathMatch: 'full' },
    
    // Rutas de animales perdidos
    ...lostPetsRoutes,
];
