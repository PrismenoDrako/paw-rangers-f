import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FoundSearch, SearchFilters } from '../../components/found-search/found-search';
import { FoundPetsContainer } from '../../components/found-pets-container/found-pets-container';
import { FoundPet } from '../../components/found-pet-card/found-pet-card';
import { Modal } from '../../components/modal/modal';

@Component({
  selector: 'app-found-pets-list',
  standalone: true,
  imports: [
    CommonModule,
    FoundSearch,
    FoundPetsContainer,
    Modal
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

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadFoundPets();
    this.loadFavorites();
    this.openModalFromRef();
  }

  private loadFoundPets(): void {
    // Datos de ejemplo - en produccion vienen del servicio
    this.foundPets = [
      {
        id: 201,
        reportRef: 'pet-2',
        type: 'Perro',
        breed: 'Mestizo',
        description: 'Vecinos reportan haber encontrado a Rocky en la clinica veterinaria del barrio.',
        location: 'Clinica veterinaria del barrio',
        foundDate: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000), // Hace 19 dias
        image: 'https://i.pinimg.com/736x/74/a4/92/74a492bb7b8e5293a3be5e145fdfaf63.jpg',
        hasCollar: true,
        contactInfo: {
          name: 'Clinica Veterinaria Central',
          phone: '+51 973 555 666',
          email: 'contacto@clinicaveterinaria.pe'
        }
      },
      {
        id: 1,
        reportRef: 'pet-101',
        type: 'Perro',
        breed: 'Labrador Retriever',
        description: 'Encontrado vagando cerca del parque. Muy amigable, parece bien cuidado.',
        location: 'Parque Central, Ciudad',
        foundDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atras
        image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
        hasCollar: true,
        contactInfo: {
          name: 'Maria Garcia',
          phone: '+1234567890',
          email: 'maria@email.com'
        }
      },
      {
        id: 2,
        reportRef: 'pet-102',
        type: 'Gato',
        breed: 'Siames',
        description: 'Gato siames encontrado en la calle. Se ve asustado pero no herido.',
        location: 'Avenida Principal',
        foundDate: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 horas atras
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
        hasCollar: false,
        contactInfo: {
          name: 'Carlos Rodriguez',
          phone: '+0987654321'
        }
      },
      {
        id: 3,
        reportRef: 'pet-103',
        type: 'Perro',
        breed: 'Mestizo pequeno',
        description: 'Perrito pequeno encontrado cerca de la escuela. Muy amigable.',
        location: 'Zona Este, Ciudad',
        foundDate: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 horas atras
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

  private openModalFromRef(): void {
    const ref = this.route.snapshot.queryParamMap.get('ref');
    if (!ref) return;
    const match = this.foundPets.find((pet) => pet.reportRef === ref || pet.id.toString() === ref);
    if (match) {
      this.selectedPet = match;
      this.showContactModal = true;
    }
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
