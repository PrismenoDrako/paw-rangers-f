import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FoundPet {
  id: number;
  type: string;
  breed?: string;
  description: string;
  location: string;
  foundDate: Date;
  image: string;
  hasCollar: boolean;
  contactInfo: {
    name: string;
    phone: string;
    email?: string;
  };
}

@Component({
  selector: 'app-found-pet-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './found-pet-card.html',
  styleUrls: ['./found-pet-card.scss']
})
export class FoundPetCard {
  @Input() foundPet!: FoundPet;
  @Input() isFavorite: boolean = false;
  @Output() onContactClick = new EventEmitter<FoundPet>();
  @Output() onFavoriteToggle = new EventEmitter<{pet: FoundPet, isFavorite: boolean}>();

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
    this.onFavoriteToggle.emit({pet: this.foundPet, isFavorite: this.isFavorite});
  }

  onContact(): void {
    this.onContactClick.emit(this.foundPet);
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Hace menos de 1 hora';
    } else if (diffInHours < 24) {
      return `Encontrado hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Encontrado hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    }
  }
}