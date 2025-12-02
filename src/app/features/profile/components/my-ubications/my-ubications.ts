import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button'; // 🚨 NECESARIO para el botón de "Añadir"
// ✅ CORRECCIÓN: Importar el componente de item de lista
import { UbicationListItemComponent } from '../ubication-list-item/ubication-list-item'; 

@Component({
  selector: 'app-my-ubications', 
  standalone: true,
  imports: [
    CommonModule, 
    CardModule,
    ButtonModule, // 🚨 Añadido
    UbicationListItemComponent // ✅ Componente de item de lista
  ],
  templateUrl: './my-ubications.html',
  // Es posible que el SCSS de ubication-card/add-ubication-card deba eliminarse si se importaba aquí
  // Si habías importado `my-ubications.scss` y contenía estilos de las tarjetas, elimínalos de ahí.
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
      longitude: -75.12345,
      user_id: 101 
    }
  ];

  // Bandera o variable de estado para controlar el formulario de añadir/editar
  isFormVisible: boolean = false; 
  
  constructor(private router: Router) { }

  openAddLocationForm(): void {
    this.router.navigate(['/crear-ubicacion']);
  }
}