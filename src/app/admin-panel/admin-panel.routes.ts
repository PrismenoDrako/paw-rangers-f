import { Routes } from '@angular/router';
import { AdminLayout } from './admin-layout/admin-layout';
import { Home } from './pages/home/home';
import { UsersList } from './pages/users/users-list';
import { UserDetail } from './pages/users/user-detail';
import { AlertsList } from './pages/alerts/alerts-list';
import { AlertDetail } from './pages/alerts/alert-detail';

export const AdminAppRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: '', component: Home, title: 'Dashboard Admin' },
      { path: 'usuarios', component: UsersList, title: 'Gestión de usuarios' },
      { path: 'usuarios/:id', component: UserDetail, title: 'Detalle de usuario' },
      { path: 'alertas', component: AlertsList, title: 'Moderación de alertas' },
      { path: 'alertas/:id', component: AlertDetail, title: 'Detalle de alerta' },
      // rutas futuras: reportes, settings
    ],
  },
];