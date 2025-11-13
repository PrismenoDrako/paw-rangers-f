import { Routes } from '@angular/router';

export const lostPetsRoutes: Routes = [
    {
        path: 'animales-perdidos',
        loadComponent: () => import('./pages/lost-pet-list/lost-pet-list')
            .then(m => m.LostPetList)
    },
    {
        path: 'animales-perdidos/report',
        loadComponent: () => import('./pages/lost-pet-report-d/lost-pet-report-d')
            .then(m => m.LostPetReportD),
        title: 'Reportar Mascota Perdida - Paw Rangers'
    },
    {
        path: 'lost-pets',
        redirectTo: 'animales-perdidos',
        pathMatch: 'full'
    },
    // Rutas auxiliares para probar componentes individuales
    {
        path: 'aux/card',
        loadComponent: () => import('./components/lost-pet-card/lost-pet-card')
            .then(m => m.LostPetCard)
    },
    {
        path: 'aux/search',
        loadComponent: () => import('./components/search/search')
            .then(m => m.Search)
    },
    {
        path: 'aux/categories',
        loadComponent: () => import('./components/categories/categories')
            .then(m => m.Categories)
    }
];