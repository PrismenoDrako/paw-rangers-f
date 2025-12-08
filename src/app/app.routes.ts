import { Routes } from '@angular/router';

export const routes: Routes = [
    // Ruta de inicio (página principal)
    {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('./public/public.routes').then(
            m => m.PublicRoutes
        )
    },
    {
        path: 'app',
        loadChildren: () => import('./user-app/user-app.routes').then(
            m => m.UserAppRoutes
        )
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin-panel/admin-panel.routes').then(
            m => m.AdminAppRoutes
        )
    },
];
