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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { environment } from '../../../../../environments/environment';

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
    SelectModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
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
    username: '',
    email: '',
    password: '',
    docNumber: '',
    role: 'user' as 'admin' | 'user',
    phone: ''
  };

  // Errores de validación
  errors = {
    name: '',
    username: '',
    email: '',
    docNumber: '',
    phone: '',
    password: ''
  };

  roleOptions = [
    { label: 'Usuario', value: 'user' },
    { label: 'Admin', value: 'admin' }
  ];

  private readonly statusSeverityMap: Record<string, TagSeverity> = {
    active: 'success',
    suspended: 'danger',
  };

  private readonly roleSeverityMap: Record<string, TagSeverity> = {
    admin: 'info',
    user: 'secondary',
  };

  private mapRole(role: any): UserRow['role'] {
    if (role && typeof role === 'object' && role.id !== undefined) {
      return {
        id: role.id,
        name: role.name || (role.id === 1 ? 'Admin' : 'Usuario'),
        isCollaborator: !!role.isCollaborator
      };
    }
    const roleId = typeof role === 'number' ? role : 2;
    return {
      id: roleId,
      name: roleId === 1 ? 'Admin' : 'Usuario',
      isCollaborator: roleId === 1
    };
  }

  private mapUser(u: any): UserRow {
    return {
      id: u.id,
      username: u.username,
      email: u.email?.value || u.email,
      name: u.name,
      lastName1: u.lastName1,
      lastName2: u.lastName2 ?? null,
      docType: u.docType ?? null,
      docNumber: u.docNumber ?? '',
      address: u.address ?? '',
      role: this.mapRole(u.role ?? u.roleId),
      isActive: u.isActive ?? true,
      createdAt: u.createdAt ?? '',
      updatedAt: u.updatedAt ?? ''
    };
  }

  constructor(
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<UsersResponse>(`${environment.apiUrl}/users`, {
      withCredentials: true
    }).subscribe({
      next: (response) => {
        const raw = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.data)
            ? response.data.data
            : [];
        this.users = raw.map((u: any) => this.mapUser(u));
      },
      error: (error) => {
        console.error('❌ Error loading users:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
        this.messageService.add({
          severity: 'error',
          summary: 'Error al cargar usuarios',
          detail: error.error?.message || 'No se pudo conectar con el servidor',
          life: 5000
        });
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
    
    this.http.put(
      `${environment.apiUrl}/users/${user.id}`,
      { isActive: newStatus },
      { withCredentials: true }
    ).subscribe({
      next: () => {
        user.isActive = newStatus;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Usuario ${newStatus ? 'activado' : 'suspendido'} correctamente`
        });
      },
      error: (error) => {
        console.error('Error updating user status:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el estado del usuario'
        });
      }
    });
  }

  openRegisterModal() {
    this.resetForm();
    this.showRegisterModal = true;
  }

  resetForm() {
    this.newUser = {
      name: '',
      username: '',
      email: '',
      password: '',
      docNumber: '',
      role: 'user',
      phone: ''
    };
    this.errors = {
      name: '',
      username: '',
      email: '',
      docNumber: '',
      phone: '',
      password: ''
    };
  }

  validateUsername(event: KeyboardEvent) {
    const char = event.key;
    // Solo permitir letras, números, guion bajo y punto
    if (!/^[a-zA-Z0-9._]$/.test(char) && event.key !== 'Backspace' && event.key !== 'Tab') {
      event.preventDefault();
    }
  }

  validateName(event: KeyboardEvent) {
    const char = event.key;
    // Solo permitir letras, espacios y tildes
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/.test(char) && event.key !== 'Backspace' && event.key !== 'Tab') {
      event.preventDefault();
    }
  }

  validatePhone(event: KeyboardEvent) {
    const char = event.key;
    const currentValue = this.newUser.phone;
    
    // Solo permitir números y limitar a 9 dígitos
    if (!/^\d$/.test(char) && event.key !== 'Backspace' && event.key !== 'Tab') {
      event.preventDefault();
    }
    
    // Evitar que se ingresen más de 9 dígitos
    if (currentValue.length >= 9 && /^\d$/.test(char)) {
      event.preventDefault();
    }
  }

  validateDocNumber(event: KeyboardEvent) {
    const char = event.key;
    const currentValue = this.newUser.docNumber;

    // Solo permitir números y limitar a 8 dígitos
    if (!/^\d$/.test(char) && event.key !== 'Backspace' && event.key !== 'Tab') {
      event.preventDefault();
    }

    if (currentValue.length >= 8 && /^\d$/.test(char)) {
      event.preventDefault();
    }
  }

  validateForm(): boolean {
    let isValid = true;
    this.errors = { name: '', username: '', email: '', docNumber: '', phone: '', password: '' };

    // Validar nombre completo (solo letras y espacios, mínimo 2 palabras)
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const nameParts = this.newUser.name.trim().split(/\s+/);
    if (!this.newUser.name.trim()) {
      this.errors.name = 'El nombre es requerido';
      isValid = false;
    } else if (!nameRegex.test(this.newUser.name)) {
      this.errors.name = 'Solo se permiten letras';
      isValid = false;
    } else if (nameParts.length < 2) {
      this.errors.name = 'Ingrese nombre y apellido';
      isValid = false;
    }

    // Validar username (solo letras, números, guion bajo y punto, mínimo 3 caracteres)
    const usernameRegex = /^[a-zA-Z0-9._]{3,}$/;
    if (!this.newUser.username.trim()) {
      this.errors.username = 'El usuario es requerido';
      isValid = false;
    } else if (!usernameRegex.test(this.newUser.username)) {
      this.errors.username = 'Mínimo 3 caracteres (letras, números, . o _)';
      isValid = false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.newUser.email.trim()) {
      this.errors.email = 'El email es requerido';
      isValid = false;
    } else if (!emailRegex.test(this.newUser.email)) {
      this.errors.email = 'Email inválido';
      isValid = false;
    }

    // Validar teléfono (exactamente 9 dígitos para Perú)
    const phoneRegex = /^\d{9}$/;
    if (!this.newUser.phone.trim()) {
      this.errors.phone = 'El teléfono es requerido';
      isValid = false;
    } else if (!phoneRegex.test(this.newUser.phone)) {
      this.errors.phone = 'Debe tener 9 dígitos';
      isValid = false;
    }

    // Validar documento (8 dígitos)
    const docRegex = /^\d{8}$/;
    if (!this.newUser.docNumber.trim()) {
      this.errors.docNumber = 'El documento es requerido';
      isValid = false;
    } else if (!docRegex.test(this.newUser.docNumber)) {
      this.errors.docNumber = 'Debe tener 8 dígitos';
      isValid = false;
    }

    // Validar contraseña (mínimo 6 caracteres)
    if (!this.newUser.password) {
      this.errors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (this.newUser.password.length < 6) {
      this.errors.password = 'Mínimo 6 caracteres';
      isValid = false;
    }

    return isValid;
  }

  registerUser() {
    if (!this.validateForm()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor corrija los errores en el formulario'
      });
      return;
    }

    const nameParts = this.newUser.name.trim().split(/\s+/);
    const userData = {
      username: this.newUser.username,
      email: this.newUser.email,
      password: this.newUser.password,
      name: nameParts[0],
      lastName1: nameParts[1] || '',
      lastName2: nameParts.length > 2 ? nameParts.slice(2).join(' ') : null,
      docNumber: this.newUser.docNumber,
      phone: this.newUser.phone,
      address: 'Perú',
      roleId: this.newUser.role === 'admin' ? 1 : 2
    };

    console.log('📤 Enviando datos de usuario:', userData);
    
    this.http.post<{ status: string; data: UserRow }>(`${environment.apiUrl}/users/register`, userData, {
      withCredentials: true
    }).subscribe({
      next: (response) => {
        console.log('✅ Usuario registrado exitosamente:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Usuario registrado correctamente',
          life: 3000
        });
        this.showRegisterModal = false;
        this.loadUsers();
      },
      error: (error) => {
        console.error('❌ Error registering user:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'No se pudo registrar el usuario'
        });
      }
    });
  }

  closeRegisterModal() {
    // Verificar si hay datos en el formulario
    const hasData = this.newUser.name || this.newUser.username || this.newUser.email || this.newUser.docNumber || this.newUser.phone || this.newUser.password;
    
    if (hasData) {
      this.confirmationService.confirm({
        message: '¿Está seguro de cancelar? Se perderán los datos ingresados.',
        header: 'Confirmar cancelación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí, cancelar',
        rejectLabel: 'No',
        accept: () => {
          this.resetForm();
          this.showRegisterModal = false;
        }
      });
    } else {
      this.showRegisterModal = false;
    }
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
