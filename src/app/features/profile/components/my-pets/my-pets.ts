// my-pets.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { CardModule } from 'primeng/card'; 
import { DialogModule } from 'primeng/dialog'; // Módulo para el modal
import { MyPetsCardsComponent } from '../my-pets-cards/my-pets-cards';
import { AddPetCardComponent } from '../add-pet-card/add-pet-card'; 
import { PetFormComponent } from '../pet-form/pet-form'; // Componente del formulario

@Component({
  selector: 'app-my-pets',
  standalone: true,
  imports: [
    CommonModule,
    CardModule, 
    MyPetsCardsComponent,
    AddPetCardComponent,
    DialogModule, 
    PetFormComponent 
  ],
  templateUrl: './my-pets.html',
  styleUrl: './my-pets.scss'
})
export class MyPetsComponent {
  
  @Input() pets: any[] = [
    { 
      id: 1, 
      name: 'Luna', 
      species: 'Gata', 
      breed: 'Angora Turco', 
      age: 3, 
      weight: 4.3, 
      status: 'Activo', 
      imageUrl: 'https://i.pinimg.com/736x/c2/46/f1/c246f1428432790f5306699e716cb413.jpg' // Imagen de prueba
    },
    // Datos de ejemplo
  ];

  // Estado para controlar la visibilidad del modal
  showPetForm: boolean = false;
  // Objeto para indicar si se está editando (contiene datos) o añadiendo (es null)
  petToEdit: any = null; 
  
  constructor() { }

  // Abre el modal en modo 'Añadir'
  openAddPetForm(): void {
    this.petToEdit = null; 
    this.showPetForm = true;
  }

  // Abre el modal en modo 'Editar' con los datos de la mascota
  onPetEdit(pet: any): void {
    this.petToEdit = pet; 
    this.showPetForm = true;
  }

  // Cierra el modal y restablece el estado de edición
  closePetForm(): void {
    this.showPetForm = false;
    this.petToEdit = null;
  }
  
  // Maneja el envío de datos desde el formulario (Guardar/Editar)
  handlePetSubmit(petData: any): void {
    if (petData.id) {
      // Lógica de EDICIÓN
      const index = this.pets.findIndex(p => p.id === petData.id);
      if (index !== -1) {
        // Actualiza la mascota y crea un nuevo array para notificar a Angular
        const newPets = [...this.pets]; 
        newPets[index] = petData; 
        this.pets = newPets; 
      }
    } else {
      // Lógica de ADICIÓN
      // Generar un ID simple
      const newId = this.pets.length > 0 ? Math.max(...this.pets.map(p => p.id)) + 1 : 1;
      const newPet = { ...petData, id: newId, status: 'Activo' };
      // Añadir la nueva mascota al array
      this.pets = [...this.pets, newPet]; 
    }
    this.closePetForm(); // Cierra el modal
  }
}