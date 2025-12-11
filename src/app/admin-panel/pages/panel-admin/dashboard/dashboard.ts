import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface DashboardData {
  status: string;
  data: {
    users: {
      total: number;
      newLast30Days: number;
      byMonth: Array<{ month: string; total: string }>;
    };
    alerts: {
      active: number;
      resolved: number;
      unresolved: number;
      byMonth: Array<{ month: string; active: string; resolved: string; unresolved: string }>;
    };
  };
  timestamp: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule, ButtonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  // Métricas de usuarios
  userMetrics = [
    { label: 'Total de usuarios', value: '0', subtitle: 'Registrados', icon: 'pi-users' },
    { label: 'Usuarios nuevos', value: '0', subtitle: 'Últimos 30 días', icon: 'pi-user-plus' },
  ];

  // Métricas de alertas
  alertMetrics = [
    { label: 'Alertas activas', value: '0', subtitle: 'Pendientes de resolución', icon: 'pi-exclamation-circle' },
    { label: 'Alertas resueltas', value: '0', subtitle: 'Total resueltas', icon: 'pi-check-circle' },
    { label: 'Alertas no resueltas', value: '0', subtitle: 'Total no resueltas', icon: 'pi-times-circle' },
  ];

  // Gráfico KPI usuarios
  userKpiChartData: any;
  userKpiChartOptions: any;

  // Gráfico comparativo alertas
  alertsCompareChartData: any;
  alertsCompareChartOptions: any;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.initializeCharts();
  }

  loadDashboardData() {
    this.http.get<DashboardData>('https://nonprejudicially-unmenacing-wanda.ngrok-free.dev/api/admin/dashboard', {
      withCredentials: true
    }).subscribe({
      next: (response) => {
        const users = response.data.users;
        const alerts = response.data.alerts;

        // Actualizar métricas de usuarios
        this.userMetrics = [
          { label: 'Total de usuarios', value: users.total.toString(), subtitle: 'Registrados', icon: 'pi-users' },
          { label: 'Usuarios nuevos', value: users.newLast30Days.toString(), subtitle: 'Últimos 30 días', icon: 'pi-user-plus' },
        ];

        // Actualizar métricas de alertas
        this.alertMetrics = [
          { label: 'Alertas activas', value: alerts.active.toString(), subtitle: 'Pendientes de resolución', icon: 'pi-exclamation-circle' },
          { label: 'Alertas resueltas', value: alerts.resolved.toString(), subtitle: 'Total resueltas', icon: 'pi-check-circle' },
          { label: 'Alertas no resueltas', value: alerts.unresolved.toString(), subtitle: 'Total no resueltas', icon: 'pi-times-circle' },
        ];

        // Actualizar gráficos con datos reales
        this.updateChartsWithData(users.byMonth, alerts.byMonth);
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
      }
    });
  }

  initializeCharts() {
    // Gráfico KPI de usuarios (línea temporal)
    this.userKpiChartData = {
      labels: [],
      datasets: [
        {
          label: 'Usuarios registrados',
          data: [],
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

    // Gráfico comparativo alertas activas vs resueltas vs no resueltas
    this.alertsCompareChartData = {
      labels: [],
      datasets: [
        {
          label: 'Alertas activas',
          data: [],
          backgroundColor: 'rgba(255, 165, 0, 0.2)',
          borderColor: '#ff9800',
          borderWidth: 2,
          tension: 0.35,
          fill: true,
        },
        {
          label: 'Alertas resueltas',
          data: [],
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          borderColor: '#4caf50',
          borderWidth: 2,
          tension: 0.35,
          fill: true,
        },
        {
          label: 'Alertas no resueltas',
          data: [],
          backgroundColor: 'rgba(244, 67, 54, 0.2)',
          borderColor: '#f44336',
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
  }

  updateChartsWithData(usersByMonth: any[], alertsByMonth: any[]) {
    const monthNames: Record<string, string> = {
      '01': 'Ene', '02': 'Feb', '03': 'Mar', '04': 'Abr', '05': 'May', '06': 'Jun',
      '07': 'Jul', '08': 'Ago', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dic'
    };

 // Actualizar gráfico de usuarios
    const userLabels = usersByMonth.map(item => {
      const [year, month] = item.month.split('-');
      return monthNames[month] || month;
    });
    const userData = usersByMonth.map(item => parseInt(item.total));

    this.userKpiChartData = {
      ...this.userKpiChartData,
      labels: userLabels,
      datasets: [{
        ...this.userKpiChartData.datasets[0],
        data: userData
      }]
    };
    // Actualizar gráfico de alertas
    const alertLabels = alertsByMonth.map(item => {
      const [year, month] = item.month.split('-');
      return monthNames[month] || month;
    });
    const activeData = alertsByMonth.map(item => parseInt(item.active));
    const resolvedData = alertsByMonth.map(item => parseInt(item.resolved));
    const unresolvedData = alertsByMonth.map(item => parseInt(item.unresolved));

    this.alertsCompareChartData = {
      ...this.alertsCompareChartData,
      labels: alertLabels,
      datasets: [
        { ...this.alertsCompareChartData.datasets[0], data: activeData },
        { ...this.alertsCompareChartData.datasets[1], data: resolvedData },
        { ...this.alertsCompareChartData.datasets[2], data: unresolvedData },
      ]
    };
  }

  navigateToUsers() {
    this.router.navigate(['/admin/users']);
  }

  navigateToAlerts() {
    this.router.navigate(['/admin/alerts']);
  }
}
