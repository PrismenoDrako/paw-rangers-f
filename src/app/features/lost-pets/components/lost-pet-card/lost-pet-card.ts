import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-lost-pet-card',
  imports: [],
  templateUrl: './lost-pet-card.html',
  styleUrl: './lost-pet-card.scss',
})
export class LostPetCard {

  @Input()
  value: number = 0;

}
