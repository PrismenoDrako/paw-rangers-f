import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Importar componentes personalizados
import { LostPetCard, LostPet } from '../../components/lost-pet-card/lost-pet-card';
import { LostContactModal } from '../../components/contact-modal/contact-modal';

@Component({
  selector: 'app-lost-pet-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LostPetCard,
    LostContactModal
  ],
  templateUrl: './lost-pet-list.html',
  styleUrls: ['./lost-pet-list.scss']
})
export class LostPetList implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = 'todos';
  showFilters: boolean = false;
  showWithReward: boolean = false;
  showRecent: boolean = false;
  showContactModal = false;
  selectedPet: LostPet | null = null;
  
  lostPets: LostPet[] = [];
  filteredPets: LostPet[] = [];
  
  categories = [
    { value: 'todos', label: 'Todos' },
    { value: 'perros', label: 'Perros' },
    { value: 'gatos', label: 'Gatos' },
    { value: 'recientes', label: 'Recientes' },
    { value: 'con-recompensa', label: 'Con Recompensa' }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadLostPets();
  }

  private loadLostPets(): void {
    // Datos de ejemplo - en produccion vienen del servicio
    this.lostPets = [
      {
        id: 101,
        name: 'Luna',
        type: 'Gato',
        breed: 'Gris atigrado',
        description: 'Vista por ultima vez cerca del parque central. Lleva collar morado.',
        location: 'Parque central',
        lostDate: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000), // Hace 19 dias
        lat: -5.1985,
        lng: -80.6264,
        image: 'https://cdn0.uncomo.com/es/posts/4/6/4/mau_egipcio_53464_1_600.jpg',
        contactInfo: {
          name: 'Laura',
          phone: '+51 987 111 222',
          email: 'laura@example.com'
        }
      },
      {
        id: 1,
        name: 'Zeus',
        type: 'Perro',
        breed: 'Pastor Aleman',
        description: 'Perdido cerca del parque central. Muy amigable, responde a su nombre.',
        location: 'Centro, Ciudad',
        lostDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // Hace 2 horas
        lat: -5.1972,
        lng: -80.6231,
        image: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=400&fit=crop',
        reward: 100,
        contactInfo: {
          name: 'Maria Garcia',
          phone: '+1234567890',
          email: 'maria@email.com'
        }
      },
      {
        id: 2,
        name: 'Naranjo',
        type: 'Gato',
        breed: 'Mestizo',
        description: 'Gato naranja perdido en el barrio. Es muy timido.',
        location: 'Zona Norte',
        lostDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Hace 1 dia
        lat: -5.1915,
        lng: -80.629,
        image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
        reward: 120,
        contactInfo: {
          name: 'Carlos Rodriguez',
          phone: '+0987654321'
        }
      },
      {
        id: 3,
        name: 'Luna',
        type: 'Perro',
        breed: 'Labrador',
        description: 'Perra dorada muy carinosa. Se perdio durante una tormenta.',
        location: 'Surco',
        lostDate: new Date(Date.now() - 6 * 60 * 60 * 1000), // Hace 6 horas
        lat: -5.205,
        lng: -80.6335,
        image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=400&fit=crop',
        reward: 200,
        contactInfo: {
          name: 'Ana Lopez',
          phone: '+1122334455'
        }
      },
      {
        id: 4,
        name: 'Mishka',
        type: 'Gato',
        breed: 'Persa',
        description: 'Gato blanco de pelo largo. No lleva collar.',
        location: 'Miraflores',
        lostDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Hace 3 dias
        lat: -5.189,
        lng: -80.6212,
        image: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=400&fit=crop',
        contactInfo: {
          name: 'Pedro Silva',
          phone: '+5566778899'
        }
      }
    ];
    this.filteredPets = [...this.lostPets];
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredPets = this.lostPets.filter(pet => {
      // Filtro por busqueda
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        const matchesSearch = 
          pet.name.toLowerCase().includes(searchLower) ||
          pet.breed.toLowerCase().includes(searchLower) ||
          pet.location.toLowerCase().includes(searchLower) ||
          pet.description.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }
      
      // Filtro por categoria
      if (this.selectedCategory && this.selectedCategory !== 'todos') {
        switch (this.selectedCategory) {
          case 'perros':
            if (!pet.type.toLowerCase().includes('perro')) return false;
            break;
          case 'gatos':
            if (!pet.type.toLowerCase().includes('gato')) return false;
            break;
          case 'con-recompensa':
            if (!pet.reward || pet.reward <= 0) return false;
            break;
          case 'recientes':
            const now = new Date();
            const diffInHours = (now.getTime() - pet.lostDate.getTime()) / (1000 * 60 * 60);
            if (diffInHours > 24) return false;
            break;
        }
      }
      
      // Filtro por recompensa
      if (this.showWithReward && (!pet.reward || pet.reward <= 0)) {
        return false;
      }
      
      // Filtro por recientes
      if (this.showRecent) {
        const now = new Date();
        const diffInHours = (now.getTime() - pet.lostDate.getTime()) / (1000 * 60 * 60);
        if (diffInHours > 24) return false;
      }
      
      return true;
    });
  }

  onContact(pet: LostPet): void {
    this.selectedPet = pet;
    this.showContactModal = true;
  }

  onOpenMap(pet: LostPet): void {
    const focusId = `lost-${pet.id}`;
    this.router.navigate(['/mapa'], { queryParams: { focus: focusId } });
  }

  closeContactModal(): void {
    this.showContactModal = false;
  }

  callOwner(pet: LostPet): void {
    const telLink = `tel:${pet.contactInfo.phone}`;
    window.open(telLink, '_self');
  }

  goToReport(): void {
    this.router.navigate(['/animales-perdidos/report']);
  }
}
