import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeNG Modules
import { CardModule } from 'primeng/card'; 
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';

import { MyPetsCardsComponent } from '../my-pets-cards/my-pets-cards';
import { AddPetCardComponent } from '../add-pet-card/add-pet-card'; 
import { Pet } from '../pet-form/pet-form'; 

@Component({
  selector: 'app-my-pets',
  standalone: true,
  imports: [
    CommonModule,
    CardModule, 
    MyPetsCardsComponent,
    AddPetCardComponent,
    ButtonModule
  ],
  templateUrl: './my-pets.html',
  styleUrl: './my-pets.scss'
})
export class MyPetsComponent {
  
  constructor(private router: Router) {}

  // Datos de prueba - Estático para compartir entre componentes
  static sharedPets: Pet[] = [
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
      imageUrl: 'https://cdn.shopify.com/s/files/1/0550/1908/4988/files/labrador_retriever.jpg?v=1676648873'
    }
  ];

  // Getter para acceder siempre al array actual
  get pets(): Pet[] {
    return MyPetsComponent.sharedPets;
  }

  // Navegar a página de crear mascota
  onAddPet(): void {
    this.router.navigate(['/crear-mascota']);
  }

  // Navegar a página de editar mascota
  onPetEdit(pet: Pet): void {
    this.router.navigate(['/editar-mascota', pet.id]);
  }
}
