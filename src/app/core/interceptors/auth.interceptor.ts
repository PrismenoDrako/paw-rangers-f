import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Agregar withCredentials: true a TODAS las peticiones
  // Esto asegura que las cookies HttpOnly se envíen automáticamente
  const authReq = req.clone({
    withCredentials: true
  });

  return next(authReq);
};
