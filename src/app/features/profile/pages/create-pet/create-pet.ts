import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PetFormComponent, Pet } from '../../components/pet-form/pet-form';
import { MyPetsComponent } from '../../components/my-pets/my-pets';

@Component({
  selector: 'app-create-pet',
  standalone: true,
  imports: [CommonModule, PetFormComponent],
  templateUrl: './create-pet.html',
  styleUrl: './create-pet.scss',
})
export class CreatePet {
  constructor(private router: Router) { }

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
    // Generar un nuevo ID para la mascota
    const newId = Math.max(...MyPetsComponent.sharedPets.map(p => p.id || 0)) + 1;
    const newPet: Pet = {
      ...petData,
      id: newId,
      imageUrl: petData.imageUrl
    };
    
    // Agregar a la lista de mascotas compartida
    MyPetsComponent.sharedPets.push(newPet);
    
    this.router.navigate(['/perfil']);
  }

  onFormCancel(): void {
    this.router.navigate(['/perfil']);
  }
}

