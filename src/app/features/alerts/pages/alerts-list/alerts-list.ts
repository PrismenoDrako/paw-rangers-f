import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Alert } from '../../models/alert.model';
import { AlertsService } from '../../services/alerts.service';
import { AlertSummaryComponent } from '../../components/alert-summary/alert-summary';

@Component({
  selector: 'app-alerts-list',
  standalone: true,
  imports: [CommonModule, AlertSummaryComponent],
  templateUrl: './alerts-list.html',
  styleUrls: ['./alerts-list.scss']
})
export class AlertsListComponent {
  alerts: Alert[] = [];

  constructor(private alertsService: AlertsService, private router: Router) {
    this.alerts = this.alertsService.getAll();
  }

  openAlert(alert: Alert): void {
    this.router.navigate(['/alertas', alert.id]);
  }
}
