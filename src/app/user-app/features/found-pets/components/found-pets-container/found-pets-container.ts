import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoundPetCard, FoundPet } from '../found-pet-card/found-pet-card';
import { SearchFilters } from '../found-search/found-search';

@Component({
  selector: 'app-found-pets-container',
  standalone: true,
  imports: [CommonModule, FoundPetCard],
  templateUrl: './found-pets-container.html',
  styleUrls: ['./found-pets-container.scss']
})
export class FoundPetsContainer {
  @Input() foundPets: FoundPet[] = [];
  @Input() favorites: number[] = [];
  @Input() isLoading: boolean = false;
  @Output() onContactPet = new EventEmitter<FoundPet>();
  @Output() onFavoriteUpdate = new EventEmitter<{petId: number, isFavorite: boolean}>();

  filteredPets: FoundPet[] = [];

  ngOnInit(): void {
    this.filteredPets = [...this.foundPets];
  }

  ngOnChanges(): void {
    this.filteredPets = [...this.foundPets];
  }

  applyFilters(filters: SearchFilters): void {
    this.filteredPets = this.foundPets.filter(pet => {
      // Filtro por consulta de búsqueda
      if (filters.query) {
        const query = filters.query.toLowerCase();
        const matchesQuery = 
          pet.type.toLowerCase().includes(query) ||
          pet.breed?.toLowerCase().includes(query) ||
          pet.location.toLowerCase().includes(query) ||
          pet.description.toLowerCase().includes(query);
        
        if (!matchesQuery) return false;
      }
      
      // Filtro por categoría
      if (filters.category && filters.category !== 'todos') {
        switch (filters.category) {
          case 'perros':
            if (!pet.type.toLowerCase().includes('perro')) return false;
            break;
          case 'gatos':
            if (!pet.type.toLowerCase().includes('gato')) return false;
            break;
          case 'con-collar':
            if (!pet.hasCollar) return false;
            break;
          case 'recientes':
            const now = new Date();
            const diffInHours = (now.getTime() - pet.foundDate.getTime()) / (1000 * 60 * 60);
            if (diffInHours > 24) return false;
            break;
        }
      }
      
      // Filtro por collar
      if (filters.hasCollar && !pet.hasCollar) {
        return false;
      }
      
      // Filtro por recientes
      if (filters.recentOnly) {
        const now = new Date();
        const diffInHours = (now.getTime() - pet.foundDate.getTime()) / (1000 * 60 * 60);
        if (diffInHours > 24) return false;
      }
      
      return true;
    });
  }

  getFavoriteStatus(petId: number): boolean {
    return this.favorites.includes(petId);
  }

  handleContact(pet: FoundPet): void {
    this.onContactPet.emit(pet);
  }

  handleFavoriteToggle(event: {pet: FoundPet, isFavorite: boolean}): void {
    this.onFavoriteUpdate.emit({
      petId: event.pet.id,
      isFavorite: event.isFavorite
    });
  }
}