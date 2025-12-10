import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PetFormComponent, Pet } from '../../components/pet-form/pet-form';
import { MyPetsComponent } from '../../components/my-pets/my-pets';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-create-pet',
  standalone: true,
  imports: [CommonModule, PetFormComponent, ToastModule],
  templateUrl: './create-pet.html',
  styleUrl: './create-pet.scss',
  providers: [MessageService]
})
export class CreatePet {
  private storageKey = 'paw-pets:guest';

  constructor(private router: Router, private messageService: MessageService, private auth: AuthService) { 
    const email = this.auth.user()?.email || 'guest';
    this.storageKey = `paw-pets:${email}`;
  }

  onFormSubmit(petData: Pet): void {
    console.log('Nueva mascota creada:', petData);
    
    // Si hay un archivo de imagen, convertirlo a base64
    if (petData.imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          petData.imageUrl = e.target.result as string;
          this.savePetData(petData);
        }
      };
      reader.readAsDataURL(petData.imageFile);
    } else {
      this.savePetData(petData);
    }
  }

  private savePetData(petData: Pet): void {
    const saved = localStorage.getItem(this.storageKey);
    try {
      MyPetsComponent.sharedPets = saved ? JSON.parse(saved) : [];
    } catch {
      MyPetsComponent.sharedPets = [];
    }

    // Generar un nuevo ID para la mascota
    const newId = (Math.max(0, ...MyPetsComponent.sharedPets.map(p => p.id || 0)) || 0) + 1;
    const newPet: Pet = {
      ...petData,
      id: newId,
      imageUrl: petData.imageUrl
    };
    
    // Agregar a la lista de mascotas compartida
    MyPetsComponent.sharedPets.push(newPet);
    MyPetsComponent.saveToStorage(this.storageKey);
    
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: `${petData.name} ha sido agregado correctamente`,
      life: 1500
    });
    
    setTimeout(() => this.router.navigate(['/app/perfil']), 1500);
  }

  onFormCancel(): void {
    this.router.navigate(['/app/perfil']);
  }
}

