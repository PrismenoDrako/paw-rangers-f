import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pet } from '../pet-form/pet-form'; // Importar la interfaz Pet

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-my-pets-cards',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
  ],
  templateUrl: './my-pets-cards.html',
  styleUrl: './my-pets-cards.scss'
})
export class MyPetsCardsComponent {
  
  @Input() pet: Pet | any; // Recibe el objeto mascota
  @Output() editPet = new EventEmitter<Pet>(); // 🚨 Evento para emitir la mascota a editar

  constructor() { }

  onEditPet(): void {
    console.log('Editar mascota:', this.pet.name);
    this.editPet.emit(this.pet); // 🚨 EMITIR el objeto mascota completo
  }
}