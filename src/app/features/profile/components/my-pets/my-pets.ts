// my-pets.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { CardModule } from 'primeng/card'; 
import { MyPetsCardsComponent } from '../my-pets-cards/my-pets-cards';
import { AddPetCardComponent } from '../add-pet-card/add-pet-card'; 
import { PetFormComponent } from '../pet-form/pet-form'; // 🚨 IMPORTAR EL FORMULARIO

@Component({
  selector: 'app-my-pets',
  standalone: true,
  imports: [
    CommonModule,
    CardModule, 
    MyPetsCardsComponent,
    AddPetCardComponent,
    PetFormComponent // 🚨 AÑADIR EL FORMULARIO A LOS IMPORTS
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
      imageUrl: 'https://i.pinimg.com/736x/c2/46/f1/c246f1428432790f5306699e716cb413.jpg'
    },
    // Puedes añadir más mascotas aquí...
  ];
  
  // 🚨 ESTADO DE EDICIÓN
  isEditing: boolean = false;
  editingPet: any = null; // Almacena el objeto de la mascota a editar

  constructor() { }
  
  // 🚨 FUNCIÓN PARA INICIAR LA EDICIÓN (llamada por la tarjeta)
  onPetEdit(pet: any) {
    this.isEditing = true;
    this.editingPet = pet; // Carga los datos de la mascota
    console.log('Iniciando edición de mascota:', pet.name);
  }
  
  // 🚨 FUNCIÓN PARA CERRAR EL FORMULARIO (llamada por el formulario al guardar o cancelar)
  onFormClosed() {
    this.isEditing = false;
    this.editingPet = null;
    // Aquí iría la lógica para recargar la lista de mascotas después de guardar
    console.log('Formulario cerrado. Volviendo a la lista.');
  }
}