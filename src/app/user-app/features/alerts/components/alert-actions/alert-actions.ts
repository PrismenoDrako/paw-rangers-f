import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-actions.html',
  styleUrls: ['./alert-actions.scss']
})
export class AlertActionsComponent {
  @Input() showMarkResolved = true;

  @Output() viewReport = new EventEmitter<void>();
  @Output() markResolved = new EventEmitter<void>();
}
