import { Routes } from '@angular/router';

export const mapExplorerRoutes: Routes = [
  {
    path: 'mapa',
    loadComponent: () => import('./pages/map-explorer/map-explorer').then((m) => m.MapExplorerPage),
    title: 'Explorar en mapa - Paw Rangers'
  }
];
