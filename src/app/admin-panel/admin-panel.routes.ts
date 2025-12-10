import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ComunicadosAdminPage } from './comunicados/comunicados-admin.page';

export const AdminAppRoutes: Routes = [
    {
        path: '',
        component: Home,
    },
    {
        path: 'comunicados',
        component: ComunicadosAdminPage,
    },
];
