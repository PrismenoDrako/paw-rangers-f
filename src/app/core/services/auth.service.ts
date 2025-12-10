import { Injectable, computed, signal } from '@angular/core';
import { Observable, delay, of, tap, throwError } from 'rxjs';
import { AuthResponse, User } from '../models/user.model';

interface AuthState {
  user: User | null;
  token: string | null;
}

const STORAGE_KEY = 'paw-rangers-auth';
const ADMIN_EMAILS = ['admin@pawrangers.com'];
const USERS_KEY = 'paw-rangers-users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly state = signal<AuthState>(this.loadState());

  readonly user = computed(() => this.state().user);
  readonly token = computed(() => this.state().token);
  readonly isAuthenticated = computed(() => !!this.state().token);

  login(email: string, password: string): Observable<AuthResponse> {
    const users = this.loadUsers();
    const normalizedEmail = (email || '').trim().toLowerCase();
    const found = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
    );

    if (!found) {
      return throwError(() => new Error('Credenciales inválidas'));
    }

    const user: User = {
      id: found.id,
      email: found.email,
      name: found.name,
      documentId: found.documentId,
      phone: found.phone,
      address: found.address,
      profileImage: found.profileImage,
      createdAt: new Date(found.createdAt),
      updatedAt: new Date(found.updatedAt),
      roles: found.roles,
    };

    const response: AuthResponse = {
      user,
      token: 'demo-token',
      refreshToken: 'demo-refresh',
    };

    return of(response).pipe(
      delay(300),
      tap((res) => this.setState({ user: res.user, token: res.token }))
    );
  }

  register(email: string, password: string, name: string): Observable<AuthResponse> {
    const users = this.loadUsers();
    const normalizedEmail = (email || '').trim().toLowerCase();
    const exists = users.some((u) => u.email.toLowerCase() === normalizedEmail);
    if (exists) {
      return throwError(() => new Error('El correo ya está registrado.'));
    }

    const newUser = {
      id: Date.now(),
      email: normalizedEmail,
      name,
      password,
      documentId: '',
      phone: '',
      address: '',
      profileImage: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      roles: ['user'],
    };
    users.push(newUser);
    this.saveUsers(users);

    const user: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      documentId: '',
      phone: '',
      address: '',
      profileImage: '',
      createdAt: new Date(newUser.createdAt),
      updatedAt: new Date(newUser.updatedAt),
      roles: newUser.roles,
    };

    const response: AuthResponse = {
      user,
      token: 'demo-token',
      refreshToken: 'demo-refresh',
    };

    return of(response).pipe(
      delay(400),
      tap((res) => this.setState({ user: res.user, token: res.token }))
    );
  }

  forgotPassword(email: string): Observable<{ ok: boolean }> {
    return of({ ok: true }).pipe(delay(400));
  }

  resetPassword(token: string, password: string): Observable<{ ok: boolean }> {
    return of({ ok: true }).pipe(delay(400));
  }

  logout(): void {
    this.setState({ user: null, token: null });
  }

  isAdmin(): boolean {
    return this.state().user?.roles?.includes('admin') ?? false;
  }

  updateProfile(data: Partial<User> & { password?: string; profileImage?: string }): void {
    const current = this.state().user;
    if (!current) return;

    const updatedUser: User = {
      ...current,
      ...data,
      profileImage: data.profileImage ?? current.profileImage,
      updatedAt: new Date(),
    };

    // Actualizar store de usuarios mock
    const users = this.loadUsers();
    const idx = users.findIndex((u) => u.id === current.id || u.email === current.email);
    if (idx !== -1) {
      users[idx] = {
        ...users[idx],
        ...data,
        password: data.password ?? users[idx].password,
        profileImage: data.profileImage ?? users[idx].profileImage,
        updatedAt: new Date().toISOString(),
        // si cambia el email, respetar el nuevo para futuros logins
        email: data.email ? data.email.trim().toLowerCase() : users[idx].email,
        createdAt: typeof users[idx].createdAt === 'string' ? users[idx].createdAt : new Date(users[idx].createdAt).toISOString(),
      };
      this.saveUsers(users);
    }

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

  private loadUsers(): Array<{
    id: number;
    email: string;
    name: string;
    password: string;
    documentId: string;
    phone: string;
    address: string;
    profileImage?: string;
    createdAt: string;
    updatedAt: string;
    roles: string[];
  }> {
    const stored = localStorage.getItem(USERS_KEY);
    let users: Array<any> = [];
    if (stored) {
      try {
        users = JSON.parse(stored) as any[];
      } catch {
        users = [];
      }
    }

    // Seed admin if missing
    const adminExists = users.some((u) => u.email?.toLowerCase() === ADMIN_EMAILS[0]);
    if (!adminExists) {
      users.push({
        id: 1,
        email: ADMIN_EMAILS[0],
        name: 'Administrador PawRangers',
        password: 'Admin123!',
        documentId: '',
        phone: '',
        address: '',
        profileImage: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        roles: ['admin'],
      });
    }

    this.saveUsers(users);
    return users;
  }

  private saveUsers(users: any[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}
