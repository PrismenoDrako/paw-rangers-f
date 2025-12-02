import { Routes } from '@angular/router';
import { Profile } from './pages/profile/profile';
import { EditProfilePage } from './pages/edit-profile/edit-profile';
import { CreatePet } from './pages/create-pet/create-pet';
import { EditPet } from './pages/edit-pet/edit-pet';
import { CreateUbicationPage } from './pages/create-ubication/create-ubication';
import { EditUbicationPage } from './pages/edit-ubication/edit-ubication';

export const profileRoutes: Routes = [
  {
    path: 'perfil',
    component: Profile,
  },
  {
    path: 'editar-perfil',
    component: EditProfilePage,
  },
  {
    path: 'crear-mascota',
    component: CreatePet,
  },
  {
    path: 'editar-mascota/:id',
    component: EditPet,
  },
  {
    path: 'crear-ubicacion',
    component: CreateUbicationPage,
  },
  {
    path: 'editar-ubicacion/:id',
    component: EditUbicationPage,
  },
];
