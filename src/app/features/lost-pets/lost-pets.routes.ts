import { Routes } from '@angular/router';

export const lostPetsRoutes: Routes = [
    {
        path: 'lost-pets',
        loadComponent: () => import('./pages/lost-pet-list/lost-pet-list')
        .then(m => m.LostPetList)
    }
];