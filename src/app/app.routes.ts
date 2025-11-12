import { Routes } from '@angular/router';
import { lostPetsRoutes } from './features/lost-pets/lost-pets.routes';

export const routes: Routes = [
    // Ruta de inicio (página principal)
    { path: '', redirectTo: '/inicio', pathMatch: 'full' },
    
    
    // Rutas de animales perdidos
    ...lostPetsRoutes,
    
];
