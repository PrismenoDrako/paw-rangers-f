import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FoundSearch, SearchFilters } from '../../components/found-search/found-search';
import { FoundPetsContainer } from '../../components/found-pets-container/found-pets-container';
import { FoundPet } from '../../components/found-pet-card/found-pet-card';

@Component({
  selector: 'app-found-pets-list',
  standalone: true,
  imports: [
    CommonModule,
    FoundSearch,
    FoundPetsContainer
  ],
  templateUrl: './found-pets-list.html',
  styleUrls: ['./found-pets-list.scss']
})
export class FoundPetsList implements OnInit {
  @ViewChild('petsContainer') petsContainer!: FoundPetsContainer;

  foundPets: FoundPet[] = [];
  favoriteIds: number[] = [];
  isLoading: boolean = false;
  showContactModal: boolean = false;
  selectedPet: FoundPet | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadFoundPets();
    this.loadFavorites();
  }

  private loadFoundPets(): void {
    // Datos de ejemplo - en producción vienen del servicio
    this.foundPets = [
      {
        id: 1,
        type: 'Perro',
        breed: 'Labrador Retriever',
        description: 'Encontrado vagando cerca del parque. Muy amigable, parece bien cuidado.',
        location: 'Parque Central, Ciudad',
        foundDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
        hasCollar: true,
        contactInfo: {
          name: 'María García',
          phone: '+1234567890',
          email: 'maria@email.com'
        }
      },
      {
        id: 2,
        type: 'Gato',
        breed: 'Siamés',
        description: 'Gato siamés encontrado en la calle. Se ve asustado pero no herido.',
        location: 'Avenida Principal',
        foundDate: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 horas atrás
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
        hasCollar: false,
        contactInfo: {
          name: 'Carlos Rodriguez',
          phone: '+0987654321'
        }
      },
      {
        id: 3,
        type: 'Perro',
        breed: 'Mestizo pequeño',
        description: 'Perrito pequeño encontrado cerca de la escuela. Muy amigable.',
        location: 'Zona Este, Ciudad',
        foundDate: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 horas atrás
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop',
        hasCollar: true,
        contactInfo: {
          name: 'Ana Martinez',
          phone: '+1122334455',
          email: 'ana@email.com'
        }
      }
    ];
  }

  private loadFavorites(): void {
    // Cargar favoritos desde localStorage
    const saved = localStorage.getItem('foundPetsFavorites');
    this.favoriteIds = saved ? JSON.parse(saved) : [];
  }

  private saveFavorites(): void {
    localStorage.setItem('foundPetsFavorites', JSON.stringify(this.favoriteIds));
  }

  handleFiltersUpdate(filters: SearchFilters): void {
    this.petsContainer.applyFilters(filters);
  }

  handleContact(pet: FoundPet): void {
    this.selectedPet = pet;
    this.showContactModal = true;
  }

  handleFavoriteUpdate(event: {petId: number, isFavorite: boolean}): void {
    if (event.isFavorite) {
      if (!this.favoriteIds.includes(event.petId)) {
        this.favoriteIds.push(event.petId);
      }
    } else {
      this.favoriteIds = this.favoriteIds.filter(id => id !== event.petId);
    }
    this.saveFavorites();
  }

  goToReport(): void {
    this.router.navigate(['/animales-encontrados/report']);
  }

  closeContactModal(): void {
    this.showContactModal = false;
    this.selectedPet = null;
  }

  callOwner(): void {
    if (this.selectedPet?.contactInfo.phone) {
      window.location.href = `tel:${this.selectedPet.contactInfo.phone}`;
    }
  }
}