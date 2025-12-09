import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, TagModule, ButtonModule, CardModule],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss',
})
export class UserDetail {
  user = {
    id: 'USR-1003',
    name: 'Carlos Méndez',
    email: 'carlos.mendez@pawrangers.io',
    role: 'Admin',
    status: 'Activo',
    reportesCreados: 0,
    ultimaActividad: 'Hace 25 min',
    createdAt: '14 Feb 2024',
    notas: 'Administrador del sistema, acceso total a todas las funciones de moderación.',
  };

  recentActivity = [
    { type: 'Login', label: 'Inició sesión', time: 'Hace 25 min' },
    { type: 'Aprobación', label: 'Aprobó alerta de desaparición', time: 'Hace 1 h' },
    { type: 'Reporte', label: 'Revisó reportes del sistema', time: 'Hoy 09:12' },
  ];

  statusSeverity(status: string) {
    return status === 'Activo' ? 'success' : 'danger';
  }

  toggleStatus() {
    this.user.status = this.user.status === 'Activo' ? 'Suspendido' : 'Activo';
  }

  resetPassword() {
    console.info('Reset password for', this.user.id);
  }
}
