import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Alert } from '../../models/alert.model';

@Component({
  selector: 'app-alert-report-meta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-report-meta.html',
  styleUrls: ['./alert-report-meta.scss']
})
export class AlertReportMetaComponent {
  @Input({ required: true }) alert!: Alert;
  @Output() viewReport = new EventEmitter<void>();

  get reportLabel(): string {
    return this.alert.reportType === 'lost' ? 'Mascota perdida' : 'Mascota encontrada';
  }
}
