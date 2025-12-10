import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null;

interface AlertRow {
  id: string;
  title: string;
  type: 'Desaparición' | 'Hallazgo';
  status: 'Pendiente' | 'En revisión' | 'Aprobada' | 'Rechazada' | 'Resuelta';
  zone: string;
  reporter: string;
  createdAt: string;
}

@Component({
  selector: 'app-alerts-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, TagModule, ButtonModule, InputTextModule, SelectModule],
  templateUrl: './alerts-list.html',
  styleUrl: './alerts-list.scss',
})
export class AlertsList {
  searchTerm = '';
  selectedType: AlertRow['type'] | 'Todas' = 'Todas';
  selectedStatus: AlertRow['status'] | 'Todas' = 'Todas';

  typeOptions = [
    { label: 'Todas', value: 'Todas' },
    { label: 'Desaparición', value: 'Desaparición' },
    { label: 'Hallazgo', value: 'Hallazgo' },
  ];
  statusOptions = [
    { label: 'Todas', value: 'Todas' },
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'En revisión', value: 'En revisión' },
    { label: 'Aprobada', value: 'Aprobada' },
    { label: 'Rechazada', value: 'Rechazada' },
    { label: 'Resuelta', value: 'Resuelta' },
  ];

  alerts: AlertRow[] = [
    {
      id: 'ALT-2031',
      title: 'Perro visto en parque central',
      type: 'Hallazgo',
      status: 'En revisión',
      zone: 'Quito · Norte',
      reporter: 'María Gómez',
      createdAt: 'Hoy 08:45',
    },
    {
      id: 'ALT-1990',
      title: 'Gato gris desaparecido hace 3 días',
      type: 'Desaparición',
      status: 'Pendiente',
      zone: 'Guayaquil · Sur',
      reporter: 'Luis Torres',
      createdAt: 'Ayer 18:12',
    },
    {
      id: 'ALT-1877',
      title: 'Cachorro de pastor alemán encontrado',
      type: 'Hallazgo',
      status: 'Aprobada',
      zone: 'Cuenca · Centro',
      reporter: 'Ana Silva',
      createdAt: 'Ayer 10:05',
    },
    {
      id: 'ALT-1803',
      title: 'Perrita pequeña desaparecida (resuelta)',
      type: 'Desaparición',
      status: 'Resuelta',
      zone: 'Quito · Valles',
      reporter: 'Carlos Méndez',
      createdAt: '12 Jun 2024',
    },
  ];

  get filteredAlerts(): AlertRow[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.alerts.filter((a) => {
      const matchesTerm =
        !term || a.title.toLowerCase().includes(term) || a.id.toLowerCase().includes(term) || a.zone.toLowerCase().includes(term);
      const matchesType = this.selectedType === 'Todas' || a.type === this.selectedType;
      const matchesStatus = this.selectedStatus === 'Todas' || a.status === this.selectedStatus;
      return matchesTerm && matchesType && matchesStatus;
    });
  }

  private readonly tagSeverityMap: Record<AlertRow['status'], TagSeverity> = {
    Pendiente: 'warn',
    'En revisión': 'info',
    Aprobada: 'success',
    Rechazada: 'danger',
    Resuelta: 'success',
  };

  statusSeverity(status: AlertRow['status']): TagSeverity {
    return this.tagSeverityMap[status] ?? 'info';
  }

  approve(alert: AlertRow) {
    alert.status = 'Aprobada';
  }

  reject(alert: AlertRow) {
    alert.status = 'Rechazada';
  }

  resolve(alert: AlertRow) {
    alert.status = 'Resuelta';
  }
}
