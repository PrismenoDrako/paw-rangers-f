import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PetFormComponent, Pet } from '../../components/pet-form/pet-form';
import { MyPetsComponent } from '../../components/my-pets/my-pets';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-pet',
  standalone: true,
  imports: [CommonModule, PetFormComponent],
  templateUrl: './edit-pet.html',
  styleUrl: './edit-pet.scss',
})
export class EditPet implements OnInit, OnDestroy {
  petData: Pet | null = null;
  private routeSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute
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
      // Buscar siempre desde el array compartido actualizado
      this.petData = MyPetsComponent.sharedPets.find(p => p.id === id) || null;
      console.log('Pet data loaded:', this.petData);
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
          this.savePetData(petData);
        }
      };
      reader.onerror = () => {
        console.error('Error reading file');
        alert('Error al cargar la imagen');
      };
      reader.readAsDataURL(petData.imageFile);
    } else {
      this.savePetData(petData);
    }
  }

  private savePetData(petData: Pet): void {
    console.log('savePetData called with:', petData);
    
    if (petData.id) {
      const index = MyPetsComponent.sharedPets.findIndex(p => p.id === petData.id);
      console.log('Pet index in array:', index);
      
      if (index !== -1) {
        // Crear objeto actualizado manteniendo el ID
        const updatedPet: Pet = {
          ...MyPetsComponent.sharedPets[index],
          ...petData,
          id: petData.id
        };
        
        // Actualizar en el array
        MyPetsComponent.sharedPets[index] = updatedPet;
        console.log('Pet updated in array:', updatedPet);
        console.log('Current pets array:', MyPetsComponent.sharedPets);
      } else {
        console.error('Pet not found in array with id:', petData.id);
        alert('Error: No se encontró la mascota a actualizar');
        return;
      }
    }
    
    console.log('Navigating to /perfil');
    this.router.navigate(['/perfil']);
  }

  onFormCancel(): void {
    this.router.navigate(['/perfil']);
  }

  onFormDelete(petId: number): void {
    console.log('Mascota eliminada:', petId);
    MyPetsComponent.sharedPets = MyPetsComponent.sharedPets.filter(p => p.id !== petId);
    this.router.navigate(['/perfil']);
  }
}

