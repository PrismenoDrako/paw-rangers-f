import { CanMatchFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanMatchFn = (): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isAuth = auth.isAuthenticated();
  const isAdminUser = auth.isAdmin();

  console.log('AdminGuard - isAuth:', isAuth, 'isAdmin:', isAdminUser);

  if (isAuth && isAdminUser) {
    return true;
  }

  // Si no está autenticado o no es admin, redirigir a login
  return router.createUrlTree(['/auth']);
};
