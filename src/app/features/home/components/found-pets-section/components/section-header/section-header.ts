import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './section-header.html',
  styleUrl: './section-header.scss'
})
export class SectionHeader {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() icon: string = 'pi-search';
  @Input() showViewAll: boolean = true;
  @Output() viewAllClick = new EventEmitter<void>();

  onViewAllClick(): void {
    this.viewAllClick.emit();
  }
}
