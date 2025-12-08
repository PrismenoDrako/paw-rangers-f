import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LostPetCard } from '../lost-pet-card/lost-pet-card';
import { LostPet } from '../../models/lost-pet.model';

@Component({
  selector: 'app-lost-pets',
  standalone: true,
  imports: [CommonModule, LostPetCard],
  templateUrl: './lost-pets.html',
  styleUrls: ['./lost-pets.scss']
})
export class LostPets implements OnInit {

  // Datos de ejemplo para las mascotas perdidas
  lostPets: LostPet[] = [
    {
      id: 1,
      name: 'Zeus',
      type: 'Perro',
      breed: 'Pastor Alemán',
      location: 'Centro, Ciudad',
      lostDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // Hace 2 horas
      reward: 100,
      image: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=400&fit=crop',
      description: 'Perdido cerca del parque central. Muy amigable, responde a su nombre.',
      contactInfo: {
        name: 'María García',
        phone: '+1234567890',
        email: 'maria@email.com'
      }
    },
    {
      id: 2,
      name: 'Naranjo',
      type: 'Gato',
      breed: 'Mestizo',
      location: 'Norte, Ciudad',
      lostDate: new Date(Date.now() - 5 * 60 * 60 * 1000), // Hace 5 horas
      reward: 120,
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
      description: 'Gato naranja, muy amigable. Se escapó durante una tormenta.',
      contactInfo: {
        name: 'Carlos Rodriguez',
        phone: '+0987654321'
      }
    },
    {
      id: 3,
      name: 'Lucy',
      type: 'Perro',
      breed: 'Beagle',
      location: 'Sur, Ciudad',
      lostDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Hace 1 día
      reward: 80,
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop',
      description: 'Perrita muy cariñosa, tiene collar rosa.',
      contactInfo: {
        name: 'Ana López',
        phone: '+1122334455'
      }
    }
  ];

  constructor() { }

  ngOnInit(): void { }

  onContact(pet: LostPet): void {
    console.log('Contactando por:', pet.name);
    console.log('Teléfono:', pet.contactInfo.phone);
    // Aquí puedes implementar la lógica de contacto
  }

  onOpenMap(pet: LostPet): void {
    console.log('Abriendo mapa para localizar a:', pet.name);
    console.log('Ubicación:', pet.location);
    // Aquí puedes implementar la lógica para abrir el mapa
    // Por ejemplo: abrir Google Maps, mostrar un modal con mapa, etc.
    
    // Ejemplo de URL para Google Maps (puedes cambiar esto)
    const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(pet.location)}`;
    window.open(mapUrl, '_blank');
  }
}
