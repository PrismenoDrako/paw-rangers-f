import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PetFormComponent, Pet } from '../../components/pet-form/pet-form';
import { MyPetsComponent } from '../../components/my-pets/my-pets';
import { AuthService } from '../../../../../core/services/auth.service';
import { PetService } from '../../../../../core/services/pet.service';

@Component({
  selector: 'app-create-pet',
  standalone: true,
  imports: [CommonModule, PetFormComponent, ToastModule],
  templateUrl: './create-pet.html',
  styleUrl: './create-pet.scss',
  providers: [MessageService]
})
export class CreatePet {
  private readonly petService = inject(PetService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly auth = inject(AuthService);

  onFormSubmit(petData: Pet): void {
    console.log('Datos del formulario recibidos:', petData);
    
    // Validar que todos los campos requeridos existan
    if (!petData.name || !petData.name.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre de la mascota es requerido',
        life: 3000
      });
      return;
    }

    if (!petData.age || petData.age < 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La edad debe ser un número válido',
        life: 3000
      });
      return;
    }

    if (!petData.speciesId || petData.speciesId <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debes seleccionar una especie válida',
        life: 3000
      });
      return;
    }

    if (!petData.breedId || petData.breedId <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debes seleccionar una raza válida',
        life: 3000
      });
      return;
    }
    
    // Enviar al backend los campos correctos
    const createPetDto = {
      name: petData.name.trim(),
      age: Number(petData.age),
      speciesId: Number(petData.speciesId),
      breedId: Number(petData.breedId),
      imageFile: petData.imageFile // Incluir el archivo de imagen si existe
    };

    console.log('DTO a enviar al backend:', createPetDto);

    this.petService.createUserPet(createPetDto).subscribe({
      next: (response) => {
        console.log('Mascota creada exitosamente:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `${petData.name} ha sido agregado correctamente`,
          life: 1500
        });
        
        // Redirigir al perfil después de 1.5 segundos
        setTimeout(() => {
          // Recargar mascotas en el componente compartido
          this.petService.getUserPets().subscribe({
            next: (pets) => {
              // Actualizar el array estático
              MyPetsComponent.sharedPets = (pets.data || pets) as any[];
              console.log('Mascotas recargadas:', MyPetsComponent.sharedPets);
              
              // Navegar a perfil (va a recargar el componente)
              void this.router.navigate(['/app/perfil']);
            },
            error: (err) => {
              console.error('Error recargando mascotas:', err);
              void this.router.navigate(['/app/perfil']);
            }
          });
        }, 1500);
      },
      error: (err) => {
        console.error('Error al crear mascota:', err);
        console.error('Detalles del error:', err?.error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.message || err?.message || 'No pudimos crear la mascota. Intenta de nuevo.',
          life: 3000
        });
      }
    });
  }

  onFormCancel(): void {
    void this.router.navigate(['/app/perfil']);
  }
}
