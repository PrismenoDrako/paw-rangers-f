import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

// PrimeNG Modules
import { CardModule } from 'primeng/card'; 
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';

import { MyPetsCardsComponent } from '../my-pets-cards/my-pets-cards';
import { AddPetCardComponent } from '../add-pet-card/add-pet-card'; 
import { Pet } from '../pet-form/pet-form'; 
import { AuthService } from '../../../../../core/services/auth.service';
import { PetService } from '../../../../../core/services/pet.service';
import { ApiService } from '../../../../../core/services/api.service';

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
  
  constructor(private router: Router, private auth: AuthService, private petService: PetService, private apiService: ApiService) {}

  // Datos de prueba - Estático para compartir entre componentes
  static sharedPets: Pet[] = [];
  
  private speciesMap: { [key: number]: string } = {};
  private breedMap: { [key: number]: string } = {};

  ngOnInit(): void {
    const email = this.auth.user()?.email || 'guest';
    this.storageKey = `paw-pets:${email}`;
    console.log('MyPetsComponent ngOnInit - Cargando mascotas...');
    
    // Cargar especies y razas primero, luego mascotas
    this.loadSpeciesAndBreeds().then(() => {
      this.loadPetsFromAPI();
    });
  }

  /**
   * Carga las especies y razas para mapearlas después
   */
  private loadSpeciesAndBreeds(): Promise<void> {
    return new Promise((resolve) => {
      forkJoin({
        species: this.apiService.get<any>('species'),
        breeds: this.apiService.get<any>('breeds')
      }).subscribe({
        next: (result: any) => {
          // Mapear especies
          const speciesArray = result.species?.data || result.species || [];
          speciesArray.forEach((s: any) => {
            this.speciesMap[s.id] = s.name;
          });
          
          // Mapear razas
          const breedsArray = result.breeds?.data || result.breeds || [];
          breedsArray.forEach((b: any) => {
            this.breedMap[b.id] = b.name;
          });
          
          console.log('Especies cargadas:', this.speciesMap);
          console.log('Razas cargadas:', this.breedMap);
          resolve();
        },
        error: (err) => {
          console.error('Error cargando especies/razas:', err);
          resolve(); // Continuar sin mapeo
        }
      });
    });
  }

  /**
   * Enriquece los datos de las mascotas con nombres de especies, razas e imágenes
   */
  private enrichPetsData(rawPets: any[]): Pet[] {
    return rawPets.map(pet => ({
      ...pet,
      species: this.speciesMap[pet.speciesId] || 'Especie desconocida',
      breed: this.breedMap[pet.breedId] || 'Raza desconocida',
      // Mapear la primera imagen del array a imageUrl
      imageUrl: pet.images && pet.images.length > 0 ? pet.images[0].url : null
    }));
  }

  private loadPetsFromAPI(): void {
    this.petService.getUserPets().subscribe({
      next: (response: any) => {
        console.log('Respuesta de mascotas:', response);
        // El endpoint devuelve un objeto con {status, data, timestamp}
        // O directamente un array
        const rawPets = response?.data || response || [];
        // Enriquecer datos con especies, razas e imágenes
        const enrichedPets = this.enrichPetsData(Array.isArray(rawPets) ? rawPets : []);
        MyPetsComponent.sharedPets = enrichedPets;
        console.log('Mascotas enriquecidas en sharedPets:', MyPetsComponent.sharedPets);
      },
      error: (err) => {
        console.error('Error cargando mascotas:', err);
        // Si hay error, mostrar mensaje al usuario
        MyPetsComponent.sharedPets = [];
      }
    });
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
