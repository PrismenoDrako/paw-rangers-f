import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

export interface LostPet {
  id: number;
  name: string;
  type: string;
  breed: string;
  color: string;
  location: string;
  date: Date;
  reward: number;
  image: string;
  description: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
}

@Component({
  selector: 'app-lost-pet-card',
  standalone: true,
  imports: [CommonModule, TagModule, ButtonModule],
  templateUrl: './lost-pet-card.html',
  styleUrl: './lost-pet-card.scss'
})
export class LostPetCard {
  @Input() pet!: LostPet;
  @Output() cardClick = new EventEmitter<number>();

  getDaysLost(date: Date): number {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getUrgencySeverity(days: number): 'danger' | 'warn' | 'info' {
    if (days > 7) return 'danger';
    if (days > 3) return 'warn';
    return 'info';
  }

  onCardClick() {
    this.cardClick.emit(this.pet.id);
  }
}
