import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null;

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Usuario';
  reports: number;
  status: 'Activo' | 'Suspendido';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule, TableModule, TagModule, ButtonModule, TooltipModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  // Métricas de usuarios
  userMetrics = [
    { label: 'Total de usuarios', value: '1,248', subtitle: 'Registrados', icon: 'pi-users' },
    { label: 'Usuarios nuevos', value: '48', subtitle: 'Últimos 30 días', icon: 'pi-user-plus' },
  ];

  // Métricas de alertas
  alertMetrics = [
    { label: 'Alertas activas', value: '316', subtitle: 'Pendientes de resolución', icon: 'pi-exclamation-circle' },
    { label: 'Alertas resueltas', value: '932', subtitle: 'Total resueltas', icon: 'pi-check-circle' },
  ];

  // Métricas de alertas por tipo
  alertTypeMetrics = [
    { label: 'Total de alertas', value: '1,248', subtitle: 'Acumulado', icon: 'pi-bell' },
    { label: 'Alertas de hallazgo', value: '512', subtitle: '41% del total', icon: 'pi-eye' },
    { label: 'Alertas de desaparición', value: '736', subtitle: '59% del total', icon: 'pi-search' },
  ];

  // Gráfico KPI usuarios
  userKpiChartData: any;
  userKpiChartOptions: any;

  // Gráfico comparativo alertas
  alertsCompareChartData: any;
  alertsCompareChartOptions: any;

  // Gráficos de alertas por tipo (mitad/mitad)
  hallazgoChartData: any;
  desaparicionChartData: any;
  pieChartOptions: any;

  // Tabla de usuarios
  users: UserRow[] = [
    { id: 'USR-0001', name: 'Carlos Méndez', email: 'carlos.mendez@example.com', role: 'Admin', reports: 24, status: 'Activo' },
    { id: 'USR-0002', name: 'Ana Torres', email: 'ana.torres@example.com', role: 'Usuario', reports: 12, status: 'Activo' },
    { id: 'USR-0003', name: 'Luis Ramírez', email: 'luis.ramirez@example.com', role: 'Usuario', reports: 8, status: 'Suspendido' },
    { id: 'USR-0004', name: 'María González', email: 'maria.gonzalez@example.com', role: 'Usuario', reports: 15, status: 'Activo' },
    { id: 'USR-0005', name: 'Pedro Sánchez', email: 'pedro.sanchez@example.com', role: 'Usuario', reports: 6, status: 'Activo' },
  ];

  private readonly statusSeverityMap: Record<string, TagSeverity> = {
    Activo: 'success',
    Suspendido: 'danger',
  };

  private readonly roleSeverityMap: Record<string, TagSeverity> = {
    Admin: 'info',
    Usuario: 'secondary',
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Gráfico KPI de usuarios (línea temporal)
    this.userKpiChartData = {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Usuarios registrados',
          data: [820, 890, 950, 1050, 1150, 1248],
          backgroundColor: 'rgba(41, 67, 116, 0.15)',
          borderColor: '#294374',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
        },
      ],
    };

    this.userKpiChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          ticks: { color: '#6b7a90' },
          grid: { display: false },
        },
        y: {
          ticks: { color: '#6b7a90' },
          grid: { color: '#eef1f6' },
        },
      },
    };

    // Gráfico comparativo alertas activas vs resueltas
    this.alertsCompareChartData = {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Alertas activas',
          data: [45, 52, 48, 60, 55, 51],
          backgroundColor: 'rgba(255, 165, 0, 0.2)',
          borderColor: '#ff9800',
          borderWidth: 2,
          tension: 0.35,
          fill: true,
        },
        {
          label: 'Alertas resueltas',
          data: [120, 145, 160, 155, 170, 180],
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          borderColor: '#4caf50',
          borderWidth: 2,
          tension: 0.35,
          fill: true,
        },
      ],
    };

    this.alertsCompareChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#1f2d3d' },
        },
      },
      scales: {
        x: {
          ticks: { color: '#6b7a90' },
          grid: { display: false },
        },
        y: {
          ticks: { color: '#6b7a90' },
          grid: { color: '#eef1f6' },
        },
      },
    };

    // Gráficos de dona para hallazgo y desaparición
    this.hallazgoChartData = {
      labels: ['Pendientes', 'En revisión', 'Aprobadas', 'Rechazadas', 'Resueltas'],
      datasets: [
        {
          data: [45, 78, 120, 34, 235],
          backgroundColor: ['#ff9800', '#2196f3', '#4caf50', '#f44336', '#9e9e9e'],
          borderWidth: 0,
        },
      ],
    };

    this.desaparicionChartData = {
      labels: ['Pendientes', 'En revisión', 'Aprobadas', 'Rechazadas', 'Resueltas'],
      datasets: [
        {
          data: [62, 95, 180, 48, 351],
          backgroundColor: ['#ff9800', '#2196f3', '#4caf50', '#f44336', '#9e9e9e'],
          borderWidth: 0,
        },
      ],
    };

    this.pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#1f2d3d', font: { size: 11 } },
        },
      },
    };
  }

  statusSeverity(status: string): TagSeverity {
    return this.statusSeverityMap[status] ?? 'secondary';
  }

  roleSeverity(role: string): TagSeverity {
    return this.roleSeverityMap[role] ?? 'secondary';
  }

  viewUser(userId: string) {
    this.router.navigate(['/admin/usuarios', userId]);
  }

  toggleUserStatus(user: UserRow) {
    user.status = user.status === 'Activo' ? 'Suspendido' : 'Activo';
  }
}