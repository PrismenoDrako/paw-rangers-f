import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LostPet } from '../../models/lost-pet.model';

@Component({
  selector: 'app-lost-pet-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lost-pet-card.html',
  styleUrls: ['./lost-pet-card.scss']
})
export class LostPetCard {
  @Input() pet!: LostPet;
  @Output() onContact = new EventEmitter<LostPet>();
  @Output() onOpenMap = new EventEmitter<LostPet>();

  get timeAgo(): string {
    if (!this.pet || !this.pet.lostDate) return '';
    
    const now = new Date();
    const diffInMs = now.getTime() - this.pet.lostDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Perdido hace menos de 1 hora';
    } else if (diffInHours < 24) {
      return `Perdido hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Perdido hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    }
  }

  contact(): void {
    this.onContact.emit(this.pet);
  }

  openMap(): void {
    this.onOpenMap.emit(this.pet);
    console.log('Abriendo mapa para:', this.pet.name, 'en', this.pet.location);
  }
}
