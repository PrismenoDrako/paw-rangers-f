import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AppLayout } from './app-layout/app-layout';

export const UserAppRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            {
                path: '',
                component: Home
            }
        ]
    },
];