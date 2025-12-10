import { CanMatchFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanMatchFn = (): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return router.createUrlTree(['/app/home']);
  }

  return true;
};
