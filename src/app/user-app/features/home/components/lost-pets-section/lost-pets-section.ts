import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { LostPetCard, type LostPet } from './components/lost-pet-card/lost-pet-card';
import { LostSectionHeader } from './components/section-header/section-header';

@Component({
  selector: 'app-lost-pets-section',
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule,
    ButtonModule,
    TagModule,
    DialogModule,
    LostPetCard,
    LostSectionHeader
  ],
  templateUrl: './lost-pets-section.html',
  styleUrl: './lost-pets-section.scss'
})
export class LostPetsSection implements OnInit {
  lostPets: LostPet[] = [
    {
      id: 1,
      name: 'Max',
      type: 'Perro',
      breed: 'Golden Retriever',
      color: 'Dorado',
      location: 'San Isidro, Lima',
      date: new Date('2024-11-28'),
      reward: 500,
      image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400&h=300&fit=crop',
      description: 'Perro muy amigable, responde a Max. Tiene collar azul.',
      ownerName: 'Carlos Mendez',
      ownerPhone: '+51 987 654 321',
      ownerEmail: 'carlos.mendez@email.com'
    },
    {
      id: 2,
      name: 'Luna',
      type: 'Gato',
      breed: 'Siamés',
      color: 'Crema con puntos marrones',
      location: 'Miraflores, Lima',
      date: new Date('2024-11-27'),
      reward: 300,
      image: 'https://images.unsplash.com/photo-1573865526739-10c1dd7aa5b5?w=400&h=300&fit=crop',
      description: 'Gata con ojos azules, muy asustadiza.',
      ownerName: 'Laura García',
      ownerPhone: '+51 987 111 222',
      ownerEmail: 'laura@example.com'
    },
    {
      id: 3,
      name: 'Rocky',
      type: 'Perro',
      breed: 'Husky Siberiano',
      color: 'Gris y blanco',
      location: 'Surco, Lima',
      date: new Date('2024-11-26'),
      reward: 800,
      image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400&h=300&fit=crop',
      description: 'Husky de ojos azules, muy activo.',
      ownerName: 'Roberto Silva',
      ownerPhone: '+51 995 222 333',
      ownerEmail: 'rsilva@example.com'
    },
    {
      id: 4,
      name: 'Michi',
      type: 'Gato',
      breed: 'Mestizo',
      color: 'Naranja atigrado',
      location: 'Barranco, Lima',
      date: new Date('2024-11-25'),
      reward: 200,
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop',
      description: 'Gato juguetón, tiene mancha blanca en el pecho.',
      ownerName: 'Sofía Ruiz',
      ownerPhone: '+51 992 444 555',
      ownerEmail: 'sofiar@example.com'
    },
    {
      id: 5,
      name: 'Bobby',
      type: 'Perro',
      breed: 'Labrador',
      color: 'Negro',
      location: 'La Molina, Lima',
      date: new Date('2024-11-24'),
      reward: 600,
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
      description: 'Labrador adulto, muy tranquilo y educado.',
      ownerName: 'Juan Pérez',
      ownerPhone: '+51 987 666 777',
      ownerEmail: 'jperez@example.com'
    }
  ];

  responsiveOptions: any[] = [];
  selectedPet: LostPet | null = null;
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

  getDaysLost(date: Date): number {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getUrgencySeverity(days: number): 'danger' | 'warn' | 'info' {
    if (days > 7) return 'danger';
    if (days > 3) return 'warn';
    return 'info';
  }

  viewDetails(petId: number) {
    const pet = this.lostPets.find(p => p.id === petId);
    if (pet) {
      this.selectedPet = pet;
      this.showDetailModal = true;
    }
  }

  closeModal() {
    this.showDetailModal = false;
    this.selectedPet = null;
  }

  viewAllLostPets() {
    this.router.navigate(['/app/animales-perdidos']);
  }

  reportLostPet() {
    this.router.navigate(['/app/animales-perdidos/report']);
  }
}
