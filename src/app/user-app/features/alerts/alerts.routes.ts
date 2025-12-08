import { Routes } from '@angular/router';

export const alertsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/alerts-list/alerts-list').then((m) => m.AlertsListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/alert-detail/alert-detail').then((m) => m.AlertDetailComponent)
  }
];
