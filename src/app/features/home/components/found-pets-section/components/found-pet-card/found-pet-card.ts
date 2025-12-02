import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FoundPet {
  id: number;
  type: string;
  breed: string;
  color: string;
  location: string;
  date: Date;
  image: string;
  description: string;
  contactName: string;
}

@Component({
  selector: 'app-found-pet-card',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './found-pet-card.html',
  styleUrl: './found-pet-card.scss'
})
export class FoundPetCard {
  @Input() pet!: FoundPet;
  @Output() cardClick = new EventEmitter<number>();

  getDaysFound(date: Date): number {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  onCardClick(): void {
    this.cardClick.emit(this.pet.id);
  }
}
