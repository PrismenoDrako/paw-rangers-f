import { Routes } from '@angular/router';
import { AdminLayout } from './admin-layout/admin-layout';
import { Home } from './pages/home/home';
import { UsersList } from './pages/users/users-list';
import { UserDetail } from './pages/users/user-detail';
import { AlertsList } from './pages/alerts/alerts-list';
import { AlertDetail } from './pages/alerts/alert-detail';
import { ComunicadosAdminPage } from './comunicados/comunicados-admin.page';

export const AdminAppRoutes: Routes = [
    {
        path: '',
        component: AdminLayout,
        children: [
            { path: '', component: Home, title: 'Administrador del panel' },
            { path: 'usuarios', component: UsersList, title: 'Gestión de usuarios' },
            { path: 'usuarios/:id', component: UserDetail, title: 'Detalle de usuario' },
            { path: 'alertas', component: AlertsList, title: 'Moderación de alertas' },
            { path: 'alertas/:id', component: AlertDetail, title: 'Detalle de alerta' },
            { path: 'comunicados', component: ComunicadosAdminPage, title: 'Comunicados' },
            // Nuevas rutas del panel-admin
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./pages/panel-admin/dashboard/dashboard').then(
                        (m) => m.Dashboard
                    ),
                title: 'Dashboard'
            },
            {
                path: 'panel-users',
                loadComponent: () =>
                    import('./pages/panel-admin/users/users').then(
                        (m) => m.Users
                    ),
                title: 'Gestión de usuarios'
            },
            {
                path: 'panel-alerts',
                loadComponent: () =>
                    import('./pages/panel-admin/alerts/alerts').then(
                        (m) => m.Alerts
                    ),
                title: 'Estadísticas de alertas'
            },
        ],
    },
];