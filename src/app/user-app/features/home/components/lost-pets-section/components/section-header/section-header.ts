import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lost-section-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-header.html',
  styleUrl: './section-header.scss'
})
export class LostSectionHeader {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() icon: string = 'pi-exclamation-triangle';
  @Input() showViewAll: boolean = true;
  @Output() viewAllClick = new EventEmitter<void>();

  onViewAllClick() {
    this.viewAllClick.emit();
  }
}
