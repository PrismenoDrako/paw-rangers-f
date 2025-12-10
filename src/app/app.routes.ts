import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./public/public.routes').then(m => m.PublicRoutes),
  },
  {
    path: 'app',
    canMatch: [authGuard],
    loadChildren: () => import('./user-app/user-app.routes').then(m => m.UserAppRoutes),
  },
  {
    path: 'admin',
    canMatch: [authGuard, adminGuard],
    loadChildren: () => import('./admin-panel/admin-panel.routes').then(m => m.AdminAppRoutes),
  },
];
