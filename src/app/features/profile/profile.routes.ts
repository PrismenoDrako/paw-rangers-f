import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
{
    path: 'perfil',
    loadComponent: () => import('./pages/profile').then((m) => m.Profile),
    },
];
