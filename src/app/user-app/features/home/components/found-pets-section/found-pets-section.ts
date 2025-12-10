import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { type FoundPet } from './components/found-pet-card/found-pet-card';
import { SectionHeader } from './components/section-header/section-header';

@Component({
  selector: 'app-found-pets-section',
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule,
    ButtonModule,
    TagModule,
    DialogModule,
    SectionHeader
  ],
  templateUrl: './found-pets-section.html',
  styleUrl: './found-pets-section.scss'
})
export class FoundPetsSection implements OnInit {
  foundPets: FoundPet[] = [
    {
      id: 1,
      type: 'Perro',
      breed: 'Labrador',
      color: 'Negro',
      location: 'Parque Kennedy, Miraflores',
      date: new Date('2024-11-28'),
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
      description: 'Encontrado cerca del parque, muy amigable y bien cuidado.',
      contactName: 'María García',
      contactPhone: '+51 992 111 222',
      contactEmail: 'maria.garcia@email.com'
    },
    {
      id: 2,
      type: 'Gato',
      breed: 'Persa',
      color: 'Blanco',
      location: 'Av. Larco, Miraflores',
      date: new Date('2024-11-27'),
      image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400&h=300&fit=crop',
      description: 'Gato de pelo largo, parece estar bien alimentado.',
      contactName: 'Carlos Ruiz',
      contactPhone: '+51 995 333 444',
      contactEmail: 'cruiz@email.com'
    },
    {
      id: 3,
      type: 'Perro',
      breed: 'Mestizo',
      color: 'Marrón y blanco',
      location: 'San Isidro',
      date: new Date('2024-11-26'),
      image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400&h=300&fit=crop',
      description: 'Perro pequeño, tiene collar pero sin placa de identificación.',
      contactName: 'Ana López',
      contactPhone: '+51 987 555 666',
      contactEmail: 'alopez@email.com'
    },
    {
      id: 4,
      type: 'Gato',
      breed: 'Común',
      color: 'Gris atigrado',
      location: 'Barranco',
      date: new Date('2024-11-25'),
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
      description: 'Gato adulto, parece asustado pero no agresivo.',
      contactName: 'Pedro Sánchez',
      contactPhone: '+51 991 777 888',
      contactEmail: 'psanchez@email.com'
    },
    {
      id: 5,
      type: 'Perro',
      breed: 'Beagle',
      color: 'Tricolor',
      location: 'Surco',
      date: new Date('2024-11-24'),
      image: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400&h=300&fit=crop',
      description: 'Cachorro muy juguetón, encontrado en zona residencial.',
      contactName: 'Luis Fernández',
      contactPhone: '+51 988 999 111',
      contactEmail: 'lfernandez@email.com'
    }
  ];

  responsiveOptions: any[] = [];
  selectedPet: FoundPet | null = null;
  showDetailModal = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '1199px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '480px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  getDaysFound(date: Date): number {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getStatusSeverity(days: number): 'success' | 'warn' | 'danger' {
    if (days <= 2) return 'success';
    if (days <= 7) return 'warn';
    return 'danger';
  }

  viewDetails(petId: number) {
    const pet = this.foundPets.find(p => p.id === petId);
    if (pet) {
      this.selectedPet = pet;
      this.showDetailModal = true;
    }
  }

  closeModal() {
    this.showDetailModal = false;
    this.selectedPet = null;
  }

  viewAllFoundPets() {
    this.router.navigate(['/app/animales-encontrados']);
  }

  reportFoundPet() {
    this.router.navigate(['/app/animales-encontrados/report']);
  }
}
