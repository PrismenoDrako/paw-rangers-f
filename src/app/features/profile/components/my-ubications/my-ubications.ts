import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// PrimeNG Modules
import { CardModule } from 'primeng/card';
// ✅ CORRECCIÓN: Importar los componentes hijos que se usarán en la plantilla.
import { UbicationCardComponent } from '../ubication-card/ubication-card';
import { AddUbicationCardComponent } from '../add-ubication-card/add-ubication-card';

@Component({
  selector: 'app-my-ubications', 
  standalone: true,
  // ✅ CORRECCIÓN: Añadir los componentes hijos al array de imports.
  imports: [
    CommonModule, 
    CardModule, 
    UbicationCardComponent, // Componente de tarjeta de ubicación
    AddUbicationCardComponent // Componente para añadir ubicación
  ],
  templateUrl: './my-ubications.html',
  styleUrl: './my-ubications.scss'
})
export class MyUbicationsComponent { 

  // Datos de prueba
  locations: any[] = [
    {
      id: 1,
      name: 'Casa Principal',
      latitude: 10.12345,
      longitude: -75.67890,
      user_id: 101 
    },
    {
      id: 2,
      name: 'Trabajo / Oficina',
      latitude: 10.54321,
      longitude: -75.09876,
      user_id: 101
    },
    {
      id: 3,
      name: 'Casa de mis Padres',
      latitude: 10.99999,
      longitude: -75.11111,
      user_id: 101
    },
  ];

  constructor() { }

  openAddLocationForm(): void {
    // Lógica para abrir un formulario o modal
    console.log('Abriendo modal para añadir nueva ubicación...');
  }
}