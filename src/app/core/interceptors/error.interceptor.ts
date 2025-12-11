import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Error del lado del servidor
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Solicitud incorrecta';
            break;
          case 401:
            // Unauthorized: El servidor rechazó la sesión
            errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.';
            // Limpiar el estado local
            auth.clearLocalState();
            // Redirigir al login
            router.navigate(['/auth']);
            break;
          case 403:
            errorMessage = 'No tienes permiso para acceder a este recurso';
            break;
          case 404:
            errorMessage = 'Recurso no encontrado';
            break;
          case 500:
            errorMessage = 'Error interno del servidor';
            break;
          default:
            errorMessage = error.error?.message || error.message || 'Error desconocido';
        }
      }

      console.error('Error HTTP:', errorMessage, error);
      return throwError(() => new Error(errorMessage));
    })
  );
};
