import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { LoginDto, RegisterDto, AuthResponse, User } from '../models/user.model';
import { ApiResponse } from '../models/pet.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly endpoints = {
    login: 'api/auth/login',
    register: 'api/auth/register',
    refresh: 'api/auth/refresh',
    forgotPassword: 'api/auth/forgot-password',
    resetPassword: 'api/auth/reset-password'
  };

  private readonly storageKeys = {
    token: 'paw_rangers_token',
    refreshToken: 'paw_rangers_refresh_token',
    user: 'paw_rangers_user'
  };

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  /**
   * Obtiene el usuario actual desde el localStorage
   */
  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.storageKeys.user);
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Obtiene el token de autenticación
   */
  getToken(): string | null {
    return localStorage.getItem(this.storageKeys.token);
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Inicio de sesión
   */
  login(credentials: LoginDto): Observable<ApiResponse<AuthResponse>> {
    return this.apiService.post<ApiResponse<AuthResponse>>(this.endpoints.login, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setSession(response.data);
          }
        })
      );
  }

  /**
   * Registro de usuario
   */
  register(data: RegisterDto): Observable<ApiResponse<AuthResponse>> {
    return this.apiService.post<ApiResponse<AuthResponse>>(this.endpoints.register, data)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setSession(response.data);
          }
        })
      );
  }

  /**
   * Cierre de sesión
   */
  logout(): void {
    localStorage.removeItem(this.storageKeys.token);
    localStorage.removeItem(this.storageKeys.refreshToken);
    localStorage.removeItem(this.storageKeys.user);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Establece la sesión del usuario
   */
  private setSession(authResult: AuthResponse): void {
    localStorage.setItem(this.storageKeys.token, authResult.token);
    if (authResult.refreshToken) {
      localStorage.setItem(this.storageKeys.refreshToken, authResult.refreshToken);
    }
    localStorage.setItem(this.storageKeys.user, JSON.stringify(authResult.user));
    this.currentUserSubject.next(authResult.user);
  }

  /**
   * Refresca el token de autenticación
   */
  refreshToken(): Observable<ApiResponse<{ token: string }>> {
    const refreshToken = localStorage.getItem(this.storageKeys.refreshToken);
    return this.apiService.post<ApiResponse<{ token: string }>>(this.endpoints.refresh, { refreshToken })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            localStorage.setItem(this.storageKeys.token, response.data.token);
          }
        })
      );
  }

  /**
   * Solicita recuperación de contraseña
   */
  forgotPassword(email: string): Observable<ApiResponse<void>> {
    return this.apiService.post<ApiResponse<void>>(this.endpoints.forgotPassword, { email });
  }

  /**
   * Restablece la contraseña
   */
  resetPassword(token: string, newPassword: string): Observable<ApiResponse<void>> {
    return this.apiService.post<ApiResponse<void>>(this.endpoints.resetPassword, { token, newPassword });
  }
}
