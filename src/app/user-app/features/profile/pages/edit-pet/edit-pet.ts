import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PetFormComponent, Pet } from '../../components/pet-form/pet-form';
import { Subscription } from 'rxjs';
import { PetService } from '../../../../../core/services/pet.service';

@Component({
  selector: 'app-edit-pet',
  standalone: true,
  imports: [CommonModule, PetFormComponent, ToastModule],
  templateUrl: './edit-pet.html',
  styleUrl: './edit-pet.scss',
  providers: [MessageService]
})
export class EditPet implements OnInit, OnDestroy {
  petData: Pet | null = null;
  private routeSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private petService: PetService
  ) { }

  ngOnInit(): void {
    this.loadPetData();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private loadPetData(): void {
    const petId = this.route.snapshot.paramMap.get('id');
    if (petId) {
      const id = parseInt(petId);
      this.petService.getUserPets().subscribe({
        next: (pets: Pet[]) => {
          this.petData = pets.find((p: any) => p.id === id) || null;
          if (!this.petData) {
            console.warn('Pet not found with id:', id);
          }
          console.log('Pet data loaded:', this.petData);
        },
        error: (err: any) => {
          console.error('Error loading pet:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar la mascota',
            life: 2000
          });
        }
      });
    }
  }

  onFormSubmit(petData: Pet): void {
    console.log('onFormSubmit called with:', petData);
    
    // Si hay un archivo de imagen, convertirlo a base64
    if (petData.imageFile) {
      console.log('Converting image file to base64...');
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          console.log('Image converted to base64');
          petData.imageUrl = e.target.result as string;
          this.updatePetData(petData);
        }
      };
      reader.onerror = () => {
        console.error('Error reading file');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar la imagen',
          life: 2000
        });
      };
      reader.readAsDataURL(petData.imageFile);
    } else {
      this.updatePetData(petData);
    }
  }

  private updatePetData(petData: Pet): void {
    console.log('updatePetData called with:', petData);
    
    if (petData.id) {
      // Actualizar en el servidor
      this.petService.updateUserPet(petData.id, petData).subscribe({
        next: (updated: any) => {
          console.log('Pet updated:', updated);
          
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `${petData.name} ha sido actualizado correctamente`,
            life: 1500
          });
          
          setTimeout(() => this.router.navigate(['/app/perfil']), 1500);
        },
        error: (err: any) => {
          console.error('Error updating pet:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar la mascota',
            life: 2000
          });
        }
      });
    } else {
      console.error('Pet ID is missing');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error: ID de mascota no válido',
        life: 2000
      });
    }
  }

  onFormCancel(): void {
    this.router.navigate(['/app/perfil']);
  }

  onFormDelete(petId: number): void {
    this.petService.deleteUserPet(petId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Mascota eliminada correctamente',
          life: 1500
        });
        setTimeout(() => this.router.navigate(['/app/perfil']), 1500);
      },
      error: (err: any) => {
        console.error('Error al eliminar mascota:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar la mascota',
          life: 2000
        });
      }
    });
  }
}

