import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ApiService } from '../../../../core/services/api.service';

interface AlertsData {
  status: string;
  data: {
    total: number;
    totalFound: number;
    totalLost: number;
    found: {
      active: number;
      resolved: number;
      unresolved: number;
    };
    lost: {
      active: number;
      resolved: number;
      unresolved: number;
    };
  };
  timestamp: string;
}

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule],
  templateUrl: './alerts.html',
  styleUrl: './alerts.scss',
})
export class Alerts implements OnInit {
  // Métricas de alertas por tipo
  alertTypeMetrics = [
    { label: 'Total de alertas', value: '0', subtitle: 'Acumulado', icon: 'pi-bell' },
    { label: 'Alertas activas', value: '0', subtitle: 'Pendientes', icon: 'pi-exclamation-circle' },
    { label: 'Alertas resueltas', value: '0', subtitle: 'Completadas', icon: 'pi-check-circle' },
    { label: 'Alertas no resueltas', value: '0', subtitle: 'Sin resolver', icon: 'pi-times-circle' },
  ];

  // Gráficos de dona para hallazgo y desaparición (3 categorías)
  hallazgoChartData: any;
  desaparicionChartData: any;
  pieChartOptions: any;
  isLoading = false;
  loadError = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadDashboardData();
    this.initializeCharts();
  }

  loadDashboardData() {
    this.isLoading = true;
    this.loadError = false;

    this.api.get<AlertsData>('stats/alerts').subscribe({
      next: (response: AlertsData) => {
        const data = response.data;
        const totalActive = data.found.active + data.lost.active;
        const totalResolved = data.found.resolved + data.lost.resolved;
        const totalUnresolved = data.found.unresolved + data.lost.unresolved;

        this.isLoading = false;
        this.loadError = false;

        this.alertTypeMetrics = [
          { label: 'Total de alertas', value: data.total.toString(), subtitle: 'Acumulado', icon: 'pi-bell' },
          { label: 'Alertas activas', value: totalActive.toString(), subtitle: 'Pendientes', icon: 'pi-exclamation-circle' },
          { label: 'Alertas resueltas', value: totalResolved.toString(), subtitle: 'Completadas', icon: 'pi-check-circle' },
          { label: 'Alertas no resueltas', value: totalUnresolved.toString(), subtitle: 'Sin resolver', icon: 'pi-times-circle' },
        ];

        // Actualizar gráficos con datos reales de hallazgo y desaparición
        this.updateCharts(data);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.loadError = true;
        console.error('⚠️ Error loading alerts data:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
        // Mostrar valores por defecto si falla
        this.alertTypeMetrics = [
          { label: 'Total de alertas', value: 'Error', subtitle: 'No disponible', icon: 'pi-bell' },
          { label: 'Alertas activas', value: 'Error', subtitle: 'No disponible', icon: 'pi-exclamation-circle' },
          { label: 'Alertas resueltas', value: 'Error', subtitle: 'No disponible', icon: 'pi-check-circle' },
          { label: 'Alertas no resueltas', value: 'Error', subtitle: 'No disponible', icon: 'pi-times-circle' },
        ];
      }
    });
  }

  initializeCharts() {
    // Gráfico de alertas de hallazgo (3 categorías)
    this.hallazgoChartData = {
      labels: ['Activas', 'Resueltas', 'No Resueltas'],
      datasets: [
        {
          data: [0, 0, 0],
          backgroundColor: ['#ff9800', '#4caf50', '#f44336'],
          borderWidth: 0,
        },
      ],
    };

    // Gráfico de alertas de desaparición (3 categorías)
    this.desaparicionChartData = {
      labels: ['Activas', 'Resueltas', 'No Resueltas'],
      datasets: [
        {
          data: [0, 0, 0],
          backgroundColor: ['#ff9800', '#4caf50', '#f44336'],
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

  updateCharts(data: any) {
    // Gráfico de alertas de hallazgo (found)
    this.hallazgoChartData = {
      labels: ['Activas', 'Resueltas', 'No Resueltas'],
      datasets: [
        {
          data: [data.found.active, data.found.resolved, data.found.unresolved],
          backgroundColor: ['#ff9800', '#4caf50', '#f44336'],
          borderWidth: 0,
        },
      ],
    };

    // Gráfico de alertas de desaparición (lost)
    this.desaparicionChartData = {
      labels: ['Activas', 'Resueltas', 'No Resueltas'],
      datasets: [
        {
          data: [data.lost.active, data.lost.resolved, data.lost.unresolved],
          backgroundColor: ['#ff9800', '#4caf50', '#f44336'],
          borderWidth: 0,
        },
      ],
    };
  }
}
