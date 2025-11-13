// my-pets.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { CardModule } from 'primeng/card'; 
import { MyPetsCardsComponent } from '../my-pets-cards/my-pets-cards';
import { AddPetCardComponent } from '../add-pet-card/add-pet-card'; 

@Component({
  selector: 'app-my-pets',
  standalone: true,
  imports: [
    CommonModule,
    CardModule, 
    MyPetsCardsComponent,
    AddPetCardComponent 
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
      imageUrl: 'https://i.pinimg.com/736x/c2/46/f1/c246f1428432790f5306699e716cb413.jpg' // Imagen de prueba con fondo
    },
    // Añadir mascotas
  ];
  
  constructor() { }
}