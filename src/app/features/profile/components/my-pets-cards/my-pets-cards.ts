// my-pets-cards.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-my-pets-cards',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ImageModule,
    TagModule 
  ],
  templateUrl: './my-pets-cards.html',
  styleUrl: './my-pets-cards.scss'
})
export class MyPetsCardsComponent {
  
  @Input() pet: any; 
  @Output() editPet = new EventEmitter<any>(); // 🚨 Output para el botón de edición

  constructor() { }

  getSeverity(status: string): string {
    switch (status) {
      case 'Activo':
        return 'success';
      case 'Perdido':
        return 'danger';
      case 'Adoptado':
        return 'info';
      default:
        return 'secondary';
    }
  }

  onEditPet(): void {
    console.log('Editar mascota:', this.pet.name);
    this.editPet.emit(this.pet); // 🚨 Emite la mascota al componente padre
  }
}