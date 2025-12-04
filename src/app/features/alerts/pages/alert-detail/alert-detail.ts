import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertsService } from '../../services/alerts.service';
import { Alert } from '../../models/alert.model';
import { AlertSummaryComponent } from '../../components/alert-summary/alert-summary';
import { AlertMapComponent } from '../../components/alert-map/alert-map';
import { AlertTimelineComponent } from '../../components/alert-timeline/alert-timeline';

@Component({
  selector: 'app-alert-detail',
  standalone: true,
  imports: [
    CommonModule,
    AlertSummaryComponent,
    AlertMapComponent,
    AlertTimelineComponent
  ],
  templateUrl: './alert-detail.html',
  styleUrls: ['./alert-detail.scss']
})
export class AlertDetailComponent {
  alert: Alert | undefined;
  timelineMarkers: { lat: number; lng: number; label?: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertsService: AlertsService
  ) {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.alert = this.alertsService.getAlertById(id);
    if (this.alert?.timeline) {
      this.timelineMarkers = this.alert.timeline
        .filter((e) => !!e.location)
        .map((e) => ({
          lat: e.location!.lat,
          lng: e.location!.lng,
          label: e.location!.label
        }));
    }
  }

  goToReport(): void {
    if (!this.alert) return;
    const base = this.alert.reportType === 'lost' ? '/animales-perdidos' : '/animales-encontrados';
    this.router.navigate([base], { queryParams: { ref: this.alert.reportId } });
  }

  markResolved(): void {
    // Mock: marcar como resuelta no cambia backend; sólo navegamos.
    this.router.navigate(['/notificaciones']);
  }

  backToNotifications(): void {
    this.router.navigate(['/notificaciones']);
  }
}
