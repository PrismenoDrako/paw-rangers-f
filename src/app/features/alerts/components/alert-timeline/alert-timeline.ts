import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AlertEvent } from '../../models/alert.model';

@Component({
  selector: 'app-alert-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-timeline.html',
  styleUrls: ['./alert-timeline.scss']
})
export class AlertTimelineComponent {
  @Input() events: AlertEvent[] = [];
}
