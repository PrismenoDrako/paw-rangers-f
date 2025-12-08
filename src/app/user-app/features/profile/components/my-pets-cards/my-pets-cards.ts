import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importar la interfaz Pet desde pet-form/pet-form (asumiendo que estará allí)
import { Pet } from '../pet-form/pet-form'; 

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
  
  // Recibe el objeto mascota del componente padre (my-pets)
  @Input() pet: Pet | any; 
  
  // 🚨 Evento para emitir la mascota a editar al componente padre
  @Output() editPet = new EventEmitter<Pet>(); 

  constructor() { }

  /**
   * Emite el evento para que el componente padre abra el formulario de edición.
   */
  onEditPet(): void {
    console.log('Editar mascota:', this.pet.name);
    this.editPet.emit(this.pet); // EMITIR el objeto mascota completo
  }
}