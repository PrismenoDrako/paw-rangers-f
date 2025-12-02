import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Alert } from '../../models/alert.model';

@Component({
  selector: 'app-alert-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-summary.html',
  styleUrls: ['./alert-summary.scss']
})
export class AlertSummaryComponent {
  @Input({ required: true }) alert!: Alert;
  @Input() showActions = false;
  @Output() viewReport = new EventEmitter<void>();
  @Output() markResolved = new EventEmitter<void>();

  get typeLabel(): string {
    if (this.alert.type === 'community') {
      return 'Alerta comunitaria';
    }
    return this.alert.reportType === 'lost' ? 'Reporte de mascota perdida' : 'Reporte de mascota encontrada';
  }

  get statusLabel(): string {
    return this.alert.status === 'open' ? 'Abierta' : 'Resuelta';
  }

  onViewReport(): void {
    this.viewReport.emit();
  }

  onMarkResolved(): void {
    this.markResolved.emit();
  }
}
