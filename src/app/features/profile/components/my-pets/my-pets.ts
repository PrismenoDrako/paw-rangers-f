import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { CardModule } from 'primeng/card'; 

import { MyPetsCardsComponent } from '../my-pets-cards/my-pets-cards';
import { AddPetCardComponent } from '../add-pet-card/add-pet-card'; 
import { PetFormComponent, Pet } from '../pet-form/pet-form'; 

@Component({
  selector: 'app-my-pets',
  standalone: true,
  imports: [
    CommonModule,
    CardModule, 
    MyPetsCardsComponent,
    AddPetCardComponent,
    PetFormComponent 
  ],
  templateUrl: './my-pets.html',
  styleUrl: './my-pets.scss'
})
export class MyPetsComponent {
  
  // Datos de prueba 
  @Input() pets: Pet[] = [
    { 
      id: 1, 
      name: 'Luna', 
      species: 'Gata', 
      breed: 'Angora Turco', 
      gender: 'Hembra',
      age: 3, 
      imageUrl: 'https://i.pinimg.com/736x/c2/46/f1/c246f1428432790f5306699e716cb413.jpg'
    },
    { 
      id: 2, 
      name: 'Max', 
      species: 'Perro', 
      breed: 'Labrador', 
      gender: 'Macho',
      age: 5, 
      imageUrl: 'https://cdn.pixabay.com/photo/2018/05/03/22/07/dog-3372553_1280.jpg'
    },
  ];
  

  isEditing: boolean = false;
  editingPet: Pet | null = null; // Almacena el objeto de la mascota a editar/crear

  constructor() { }
  

  onAddPet(): void {

    this.editingPet = { 
        name: '', species: '', breed: '', gender: 'Macho', age: 1
    };
    this.isEditing = true;
  }
  
  //  Lógica para iniciar el Formulario para EDITAR
  onPetEdit(petToEdit: Pet): void {
    this.editingPet = petToEdit;
    this.isEditing = true;
  }
  
  // Guardar o cancelar
  onFormClosed(updatedPet: Pet | null = null): void {
      if (updatedPet) {
          // Si se seleccionó un archivo de imagen, generamos una URL temporal para mostrarla en la tarjeta inmediatamente
          if (updatedPet.imageFile) {
              try {
                  updatedPet.imageUrl = URL.createObjectURL(updatedPet.imageFile);
              } catch (e) {
                  console.warn('No se pudo crear URL temporal para la imagen:', e);
              }
          }

          const index = this.pets.findIndex(p => p.id === updatedPet.id);
          
          if (updatedPet.id && index !== -1) {
              // 🚨 Lógica de actualización (Editar)
              this.pets[index] = { ...this.pets[index], ...updatedPet };
              console.log('Mascota actualizada:', updatedPet.name);
          } else {
              // 🚨 Lógica de adición (Nueva Mascota)
              updatedPet.id = this.pets.length > 0 ? Math.max(...this.pets.map(p => p.id || 0)) + 1 : 1; 
              this.pets.push(updatedPet);
              console.log('Mascota añadida:', updatedPet.name);
          }
      }
      // Ocultar formulario y limpiar estado
      this.isEditing = false;
      this.editingPet = null;
  }
  
  // 🚨 4. Lógica al ELIMINAR
  onPetDelete(petId: number): void {
      this.pets = this.pets.filter(p => p.id !== petId);
      console.log(`Mascota con ID ${petId} eliminada.`);
      // Cerramos el formulario después de eliminar
      this.isEditing = false;
      this.editingPet = null;
  }
}