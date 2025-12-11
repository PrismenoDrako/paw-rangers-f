import { Injectable, computed, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { AuthResponse, User, LoginDto, RegisterDto } from '../models/user.model';
import { SocketService } from './socket.service';

interface AuthState {
  user: User | null;
  token: string | null;
}

const STORAGE_KEY = 'paw-rangers-auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly state = signal<AuthState>(this.loadState());
  private readonly baseUrl = 'http://localhost:3000';
  private readonly socket = inject(SocketService);

  readonly user = computed(() => this.state().user);
  readonly token = computed(() => this.state().token);
  readonly isAuthenticated = computed(() => !!this.state().user);

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const loginDto = { username, password };
    
    return this.http.post<any>(`${this.baseUrl}/auth/login`, loginDto, {
      withCredentials: true
    }).pipe(
      tap((response) => {
        // El backend devuelve { status, data: user, timestamp }
        const user = response.data;
        this.setState({ user, token: 'authenticated' });
        // Conectar al socket después de login exitoso
        this.socket.connect();
      })
    );
  }

  register(registerData: RegisterDto): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/users/register`, registerData, {
      withCredentials: true
    }).pipe(
      tap((response) => {
        const user = response.data;
        this.setState({ user, token: 'authenticated' });
        // Conectar al socket después de registro exitoso
        this.socket.connect();
      })
    );
  }

  /**
   * Obtiene los datos del usuario autenticado desde el servidor
   * Llama a GET /users y busca el usuario con el email autenticado
   */
  getCurrentUser(): Observable<any> {
    const authUser = this.state().user;
    if (!authUser?.email) {
      return throwError(() => new Error('Usuario no autenticado'));
    }
    
    console.log('getCurrentUser - Obteniendo usuario autenticado:', authUser.email);
    
    return this.http.get<any>(`${this.baseUrl}/users`, {
      withCredentials: true
    }).pipe(
      tap((response) => {
        console.log('getCurrentUser - Respuesta de /users:', response);
        
        // El endpoint devuelve {status: 'success', data: [...]}
        const usersArray = response?.data || response || [];
        
        // Buscar el usuario autenticado por email
        const user = Array.isArray(usersArray) 
          ? usersArray.find((u: any) => u.email === authUser.email)
          : null;
        
        console.log('getCurrentUser - Usuario encontrado:', user);
        
        if (user) {
          this.setState({ user, token: 'authenticated' });
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.clearState();
        // Desconectar del socket al cerrar sesión
        this.socket.disconnect();
      })
    );
  }

  /**
   * Limpia el estado local sin hacer petición al servidor
   * Usada cuando el servidor devuelve 401
   */
  clearLocalState(): void {
    this.clearState();
    // Desconectar del socket cuando la sesión expira
    this.socket.disconnect();
  }

  private clearState(): void {
    this.setState({ user: null, token: null });
  }

  /**
   * Verifica si el usuario autenticado es administrador
   */
  isAdmin(): boolean {
    const user = this.state().user;
    if (!user) return false;
    // Según el backend, un admin tiene roleId: 1 y isCollaborator: true
    return user.roleId === 1;
  }

  /**
   * Solicita recuperación de contraseña
   */
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/forgot-password`, { email }, {
      withCredentials: true
    });
  }

  /**
   * Resetea la contraseña con un token
   */
  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/reset-password`, { token, password }, {
      withCredentials: true
    });
  }

  /**
   * Actualiza el perfil del usuario en el servidor
   * Si lo necesitas síncrono para actualización local, usa updateLocalProfile()
   */
  updateProfile(data: Partial<User>): Observable<any> {
    const userId = this.state().user?.id;
    if (!userId) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    return this.http.put<any>(`${this.baseUrl}/users/${userId}`, data, {
      withCredentials: true
    }).pipe(
      tap((response) => {
        const updatedUser = { ...this.state().user, ...response.data } as User;
        this.setState({ user: updatedUser, token: this.state().token });
      })
    );
  }

  /**
   * Actualiza el perfil localmente sin hacer petición al servidor
   * Útil para actualizaciones rápidas en el UI
   */
  updateLocalProfile(data: Partial<User>): void {
    const current = this.state().user;
    if (!current) return;

    const updatedUser: User = {
      ...current,
      ...data,
      updatedAt: new Date(),
    };

    this.setState({ user: updatedUser, token: this.state().token });
  }

  private setState(next: AuthState): void {
    this.state.set(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  private loadState(): AuthState {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { user: null, token: null };
    }
    try {
      return JSON.parse(data) as AuthState;
    } catch {
      return { user: null, token: null };
    }
  }
}

