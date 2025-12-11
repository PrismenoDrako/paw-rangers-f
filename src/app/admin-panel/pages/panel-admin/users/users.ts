import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { HttpClient } from '@angular/common/http';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null;

interface UserRow {
  id: number;
  username: string;
  email: string;
  name: string;
  lastName1: string;
  lastName2: string | null;
  docType: string | null;
  docNumber: string;
  address: string;
  role: {
    id: number;
    name: string;
    isCollaborator: boolean;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  status: string;
  data: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
    data: UserRow[];
  };
  timestamp: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    PasswordModule,
    SelectModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  users: UserRow[] = [];
  selectedUser: UserRow | null = null;
  showUserModal = false;
  showRegisterModal = false;

  // Formulario de registro
  newUser = {
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
    phone: ''
  };

  roleOptions = [
    { label: 'Usuario', value: 'user' },
    { label: 'Administrador', value: 'admin' }
  ];

  private readonly statusSeverityMap: Record<string, TagSeverity> = {
    active: 'success',
    suspended: 'danger',
  };

  private readonly roleSeverityMap: Record<string, TagSeverity> = {
    admin: 'info',
    user: 'secondary',
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<UsersResponse>('http://localhost:3000/api/admin/users?page=1&size=100').subscribe({
      next: (response) => {
        this.users = response.data.data;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  statusSeverity(isActive: boolean): TagSeverity {
    return isActive ? 'success' : 'danger';
  }

  roleSeverity(role: UserRow['role']): TagSeverity {
    return role.isCollaborator ? 'info' : 'secondary';
  }

  viewUser(user: UserRow) {
    this.selectedUser = user;
    this.showUserModal = true;
  }

  toggleUserStatus(user: UserRow) {
    const newStatus = !user.isActive;
    
    this.http.patch(`http://localhost:3000/api/admin/users/${user.id}/status`, { isActive: newStatus }).subscribe({
      next: () => {
        user.isActive = newStatus;
      },
      error: (error) => {
        console.error('Error updating user status:', error);
      }
    });
  }

  openRegisterModal() {
    this.newUser = {
      name: '',
      email: '',
      password: '',
      role: 'user',
      phone: ''
    };
    this.showRegisterModal = true;
  }

  registerUser() {
    const userData = {
      username: this.newUser.email.split('@')[0],
      email: this.newUser.email,
      password: this.newUser.password,
      name: this.newUser.name.split(' ')[0],
      lastName1: this.newUser.name.split(' ')[1] || '',
      lastName2: this.newUser.name.split(' ')[2] || null,
      docNumber: '00000000',
      address: this.newUser.phone,
      roleId: this.newUser.role === 'admin' ? 1 : 2
    };

    this.http.post<{ status: string; data: UserRow }>('http://localhost:3000/api/admin/users', userData).subscribe({
      next: (response) => {
        this.users.push(response.data);
        this.showRegisterModal = false;
        this.loadUsers(); // Recargar lista
      },
      error: (error) => {
        console.error('Error registering user:', error);
      }
    });
  }

  getRoleLabel(role: UserRow['role']): string {
    return role.name;
  }

  getStatusLabel(isActive: boolean): string {
    return isActive ? 'Activo' : 'Suspendido';
  }

  getFullName(user: UserRow): string {
    return `${user.name} ${user.lastName1}${user.lastName2 ? ' ' + user.lastName2 : ''}`;
  }
}
