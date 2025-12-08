import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LostPet } from '../lost-pet-card/lost-pet-card';

@Component({
  selector: 'app-lost-contact-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-modal.html',
  styleUrls: ['./contact-modal.scss']
})
export class LostContactModal {
  @Input() showContactModal = false;
  @Input() selectedPet: LostPet | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onCallOwner = new EventEmitter<LostPet>();

  close(): void {
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
    }
    if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  }
}
