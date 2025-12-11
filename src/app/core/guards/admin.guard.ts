import { CanMatchFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanMatchFn = (): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isAuth = auth.isAuthenticated();
  const isAdminUser = auth.isAdmin();

  if (isAuth && isAdminUser) {
    return true;
  }

  return router.createUrlTree(['/auth']);
};
