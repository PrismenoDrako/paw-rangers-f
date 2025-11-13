// add-pet-card.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-add-pet-card',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './add-pet-card.html',
  styleUrl: './add-pet-card.scss'
})
export class AddPetCardComponent {

  onAddPet(): void {
    console.log('Iniciar proceso para añadir una nueva mascota.');
  }
}