import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LostPetCard } from '../lost-pet-card/lost-pet-card';

@Component({
  selector: 'app-lost-pets',
  standalone: true,
  imports: [CommonModule, LostPetCard],
  templateUrl: './lost-pets.html',
  styleUrls: ['./lost-pets.scss']
})
export class LostPets implements OnInit {

  // Datos de ejemplo para las mascotas perdidas
  lostPets = [
    {
      id: 1,
      name: 'Zeus',
      type: 'Perro',
      breed: 'Pastor Alemán',
      location: 'Centro, Ciudad',
      reward: 100.00,
      image: 'https://tse4.mm.bing.net/th/id/OIP.kupJkH5891LwxXlUvjB2GwHaFj?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
      description: 'Perdido cerca del parque central. Muy amigable, responde a su nombre.',
      timeAgo: 'Perdido hace 2 horas'
    },
    {
      id: 2,
      name: 'Naranjo',
      type: 'Gato',
      breed: 'Mestizo',
      location: 'Norte, Ciudad',
      reward: 120.00,
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop&crop=face',
      description: 'Gato naranja, muy amigable. Se escapó durante una tormenta.',
      timeAgo: 'Perdido hace 5 horas'
    },
    {
      id: 3,
      name: 'Lucy',
      type: 'Perro',
      breed: 'Beagle',
      location: 'Sur, Ciudad',
      reward: 80.00,
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop&crop=face',
      description: 'Perrita muy cariñosa, tiene collar rosa.',
      timeAgo: 'Perdido hace 1 día'
    }
  ];

  constructor() { }

  ngOnInit(): void { }

  onContact(pet: any): void {
    console.log('Contactando por:', pet.name);
    // Aquí puedes implementar la lógica de contacto
  }

  onOpenMap(pet: any): void {
    console.log('Abriendo mapa para localizar a:', pet.name);
    console.log('Ubicación:', pet.location);
    // Aquí puedes implementar la lógica para abrir el mapa
    // Por ejemplo: abrir Google Maps, mostrar un modal con mapa, etc.
    
    // Ejemplo de URL para Google Maps (puedes cambiar esto)
    const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(pet.location)}`;
    window.open(mapUrl, '_blank');
  }
}
