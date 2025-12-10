import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeNG Modules
import { CardModule } from 'primeng/card'; 
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';

import { MyPetsCardsComponent } from '../my-pets-cards/my-pets-cards';
import { AddPetCardComponent } from '../add-pet-card/add-pet-card'; 
import { Pet } from '../pet-form/pet-form'; 
import { AuthService } from '../../../../../core/services/auth.service';

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
export class MyPetsComponent implements OnInit {
  private storageKey = 'paw-pets:guest';
  
  constructor(private router: Router, private auth: AuthService) {}

  // Datos de prueba - Estático para compartir entre componentes
  static sharedPets: Pet[] = [];

  ngOnInit(): void {
    const email = this.auth.user()?.email || 'guest';
    this.storageKey = `paw-pets:${email}`;
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        MyPetsComponent.sharedPets = JSON.parse(saved);
      } catch {
        MyPetsComponent.sharedPets = [];
      }
    } else {
      MyPetsComponent.sharedPets = [];
    }
  }

  static saveToStorage(storageKey: string): void {
    try {
      localStorage.setItem(storageKey, JSON.stringify(MyPetsComponent.sharedPets));
    } catch {
      // ignore storage errors in mock mode
    }
  }

  // Getter para acceder siempre al array actual
  get pets(): Pet[] {
    return MyPetsComponent.sharedPets;
  }

  // Navegar a página de crear mascota
  onAddPet(): void {
    this.router.navigate(['/app/crear-mascota']);
  }

  // Navegar a página de editar mascota
  onPetEdit(pet: Pet): void {
    this.router.navigate(['/app/editar-mascota', pet.id]);
  }
}
