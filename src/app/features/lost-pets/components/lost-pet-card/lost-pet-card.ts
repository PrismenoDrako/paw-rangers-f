import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lost-pet-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lost-pet-card.html',
  styleUrls: ['./lost-pet-card.scss']
})
export class LostPetCard {
  @Input() pet: any;
  @Output() onContact = new EventEmitter<any>();
  @Output() onOpenMap = new EventEmitter<any>();

  contact(): void {
    this.onContact.emit(this.pet);
  }

  openMap(): void {
    this.onOpenMap.emit(this.pet);
    console.log('Abriendo mapa para:', this.pet.name, 'en', this.pet.location);
  }
}
