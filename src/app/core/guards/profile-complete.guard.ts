import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const profileCompleteGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.user();

  if (!user) {
    window.alert('Importante\n\nDebes iniciar sesión para continuar.');
    return router.createUrlTree(['/']);
  }

  const missing =
    !user.name ||
    !user.email ||
    !user.documentId ||
    !user.phone ||
    !user.address;

  if (missing) {
    window.alert(
      'Importante\n\nCompleta tu perfil (nombre, correo, documento, teléfono y dirección) para poder reportar mascotas.'
    );
    return router.createUrlTree(['/app/editar-perfil'], {
      queryParams: { from: 'report' },
    });
  }

  return true;
};
