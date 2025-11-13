import { Routes } from '@angular/router';

export const foundPetsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/found-pets-list/found-pets-list').then(m => m.FoundPetsList),
    title: 'Animales Encontrados - Paw Rangers'
  },
  {
    path: 'report',
    loadComponent: () => import('./pages/report-found-pet/report-found-pet').then(m => m.ReportFoundPet),
    title: 'Reportar Animal Encontrado - Paw Rangers'
  }
];
