import { Routes } from '@angular/router';

export const homeRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home-page/home-page').then(m => m.HomePage),
    title: 'Inicio - Paw Rangers'
  }
];
