import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../models/login-response';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authenticated: boolean | null = null;  // CACHE del estado de sesión

  constructor(private api: ApiService) {}

  // --------------------------
  // LOGIN
  // --------------------------
  login(username: string, password: string): Observable<LoginResponse> {
    return this.api.post<LoginResponse>('auth/login', { username, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('user', JSON.stringify(res.user));
          this.authenticated = true;
        })
      );
  }

  // --------------------------
  // LOGOUT
  // --------------------------
  logout() {
    this.authenticated = null; // limpiar caché
    this.api.post('auth/logout', {}, undefined).subscribe(() => {
      localStorage.removeItem('user');
    });
  }

  // --------------------------
  // VERIFICAR SESIÓN (usado por GUARD)
  // --------------------------
  async checkAuth(): Promise<boolean> {

    // Si ya sabemos el estado → no volver a preguntar al backend
    if (this.authenticated !== null) {
      return this.authenticated;
    }

    // Primera validación real
    return this.api.post('auth/check', {})
      .toPromise()
      .then(() => {
        this.authenticated = true;
        return true;
      })
      .catch(() => {
        this.authenticated = false;
        return false;
      });
  }

  // --------------------------
  // MÉTODOS DE APOYO
  // --------------------------
  getUser() {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }

  isLoggedIn(): boolean {
    return this.authenticated === true;
  }
}
