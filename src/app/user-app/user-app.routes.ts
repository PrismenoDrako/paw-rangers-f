import { Routes } from '@angular/router';
import { AppLayout } from './app-layout/app-layout';

export const UserAppRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            // Home page
            {
                path: 'home',
                loadComponent: () => import('./features/home/pages/home-page/home-page').then(m => m.HomePage),
                title: 'Inicio - Paw Rangers'
            },

            // Lost pets routes
            {
                path: 'animales-perdidos',
                loadComponent: () => import('./features/lost-pets/pages/lost-pet-list/lost-pet-list')
                    .then(m => m.LostPetList)
            },
            {
                path: 'animales-perdidos/report',
                loadComponent: () => import('./features/lost-pets/pages/lost-pet-report-d/lost-pet-report-d')
                    .then(m => m.LostPetReportD),
                title: 'Reportar Mascota Perdida - Paw Rangers'
            },

            // Found pets routes
            {
                path: 'animales-encontrados',
                loadComponent: () => import('./features/found-pets/pages/found-pets-list/found-pets-list').then(m => m.FoundPetsList),
                title: 'Animales Encontrados - Paw Rangers'
            },
            {
                path: 'animales-encontrados/report',
                loadComponent: () => import('./features/found-pets/pages/report-found-pet/report-found-pet').then(m => m.ReportFoundPet),
                title: 'Reportar Animal Encontrado - Paw Rangers'
            },

            // Map explorer
            {
                path: 'mapa',
                loadComponent: () => import('./features/map-explorer/pages/map-explorer/map-explorer').then((m) => m.MapExplorerPage),
                title: 'Explorar en mapa - Paw Rangers'
            },

            // Alerts routes
            {
                path: 'alertas',
                loadComponent: () => import('./features/alerts/pages/alerts-list/alerts-list').then((m) => m.AlertsListComponent)
            },
            {
                path: 'alertas/:id',
                loadComponent: () => import('./features/alerts/pages/alert-detail/alert-detail').then((m) => m.AlertDetailComponent)
            },

            // Profile routes
            {
                path: 'perfil',
                loadComponent: () => import('./features/profile/pages/profile/profile').then(m => m.Profile),
            },
            {
                path: 'editar-perfil',
                loadComponent: () => import('./features/profile/pages/edit-profile/edit-profile').then(m => m.EditProfilePage),
            },
            {
                path: 'crear-mascota',
                loadComponent: () => import('./features/profile/pages/create-pet/create-pet').then(m => m.CreatePet),
            },
            {
                path: 'editar-mascota/:id',
                loadComponent: () => import('./features/profile/pages/edit-pet/edit-pet').then(m => m.EditPet),
            },
            {
                path: 'crear-ubicacion',
                loadComponent: () => import('./features/profile/pages/create-ubication/create-ubication').then(m => m.CreateUbicationPage),
            },
            {
                path: 'editar-ubicacion/:id',
                loadComponent: () => import('./features/profile/pages/edit-ubication/edit-ubication').then(m => m.EditUbicationPage),
            },

            // Notifications routes
            {
                path: 'notificaciones',
                loadComponent: () => import('./features/notifications/pages/notifications').then(m => m.NotificationsComponent),
            },
            {
                path: 'notification-settings',
                loadComponent: () => import('./features/notifications/components/notification-settings/notification-settings').then(m => m.NotificationSettingsComponent),
            },

            // Legacy redirects
            {
                path: 'lost-pets',
                redirectTo: 'animales-perdidos',
                pathMatch: 'full'
            },
            {
                path: 'found-pets',
                redirectTo: 'animales-encontrados',
                pathMatch: 'prefix'
            },
        ]
    },
];