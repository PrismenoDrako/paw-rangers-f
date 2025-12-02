import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoundPet } from '../found-pet-card/found-pet-card';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  @Input() showContactModal: boolean = false;
  @Input() selectedPet: FoundPet | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onCallOwner = new EventEmitter<FoundPet>();

  closeContactModal(): void {
    this.onClose.emit();
  }

  callOwner(): void {
    if (this.selectedPet) {
      this.onCallOwner.emit(this.selectedPet);
    }
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Hace menos de 1 hora';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    }
  }
}
