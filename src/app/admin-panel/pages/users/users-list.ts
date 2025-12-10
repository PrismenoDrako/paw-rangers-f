import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Usuario';
  status: 'Activo' | 'Suspendido';
  reportesCreados: number;
  ultimaActividad: string;
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
  ],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
})
export class UsersList {
  searchTerm = '';
  selectedRole: AdminUserRow['role'] | 'Todos' = 'Todos';
  selectedStatus: AdminUserRow['status'] | 'Todos' = 'Todos';

  roleOptions = [
    { label: 'Todos', value: 'Todos' },
    { label: 'Admin', value: 'Admin' },
    { label: 'Usuario', value: 'Usuario' },
  ];
  statusOptions = [
    { label: 'Todos', value: 'Todos' },
    { label: 'Activo', value: 'Activo' },
    { label: 'Suspendido', value: 'Suspendido' },
  ];

  users: AdminUserRow[] = [
    {
      id: 'USR-1042',
      name: 'María Gómez',
      email: 'maria.gomez@pawrangers.io',
      role: 'Usuario',
      status: 'Activo',
      reportesCreados: 12,
      ultimaActividad: 'Hace 2 h',
    },
    {
      id: 'USR-1003',
      name: 'Carlos Méndez',
      email: 'carlos.mendez@pawrangers.io',
      role: 'Admin',
      status: 'Activo',
      reportesCreados: 0,
      ultimaActividad: 'Hace 25 min',
    },
    {
      id: 'USR-0994',
      name: 'Ana Silva',
      email: 'ana.silva@pawrangers.io',
      role: 'Usuario',
      status: 'Suspendido',
      reportesCreados: 5,
      ultimaActividad: 'Ayer',
    },
    {
      id: 'USR-0890',
      name: 'Luis Torres',
      email: 'luis.torres@pawrangers.io',
      role: 'Usuario',
      status: 'Activo',
      reportesCreados: 18,
      ultimaActividad: 'Hace 10 min',
    },
  ];

  get filteredUsers(): AdminUserRow[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.users.filter((u) => {
      const matchesTerm =
        !term ||
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.id.toLowerCase().includes(term);
      const matchesRole = this.selectedRole === 'Todos' || u.role === this.selectedRole;
      const matchesStatus = this.selectedStatus === 'Todos' || u.status === this.selectedStatus;
      return matchesTerm && matchesRole && matchesStatus;
    });
  }

  statusSeverity(status: AdminUserRow['status']) {
    return status === 'Activo' ? 'success' : 'danger';
  }

  toggleStatus(user: AdminUserRow) {
    user.status = user.status === 'Activo' ? 'Suspendido' : 'Activo';
  }

  resetPassword(user: AdminUserRow) {
    // placeholder action for reset flow
    console.info('Reset password for', user.id);
  }
}
