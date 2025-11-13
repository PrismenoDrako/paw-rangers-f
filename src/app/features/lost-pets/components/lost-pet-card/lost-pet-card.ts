import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-lost-pet-card',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TagModule],
  templateUrl: './lost-pet-card.html',
  styleUrls: ['./lost-pet-card.scss']
})
export class LostPetCard {
  @Input() pet: any;
  @Output() onContact = new EventEmitter<any>();

  contact(): void {
    this.onContact.emit(this.pet);
  }
}
