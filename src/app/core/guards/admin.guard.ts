import { CanMatchFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanMatchFn = (): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  console.log('🔐 Admin Guard - Iniciando verificación');
  const isAuth = auth.isAuthenticated();
  console.log('🔐 Admin Guard - isAuthenticated():', isAuth);
  
  const user = auth.getUser();
  console.log('🔐 Admin Guard - getUser():', user);
  
  const isAdminUser = auth.isAdmin();
  console.log('🔐 Admin Guard - isAdmin():', isAdminUser);

  console.log('🔐 Admin Guard Check:');
  console.log('  - Usuario:', user?.id, user?.email);
  console.log('  - Autenticado:', isAuth);
  console.log('  - RoleId:', user?.roleId);
  console.log('  - Es Admin:', isAdminUser);

  if (isAuth && isAdminUser) {
    console.log('✅ Acceso permitido a admin');
    return true;
  }

  console.log('❌ Acceso denegado - redirigiendo a /auth');
  return router.createUrlTree(['/auth']);
};
