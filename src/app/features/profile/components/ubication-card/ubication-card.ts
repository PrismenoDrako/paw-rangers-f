import { Component, Input } from '@angular/core'; 
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-ubication-card', // Selector corregido
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule
  ],
  templateUrl: './ubication-card.html',
  styleUrl: './ubication-card.scss' 
})
export class UbicationCardComponent { // Clase corregida
  
  // Recibe un objeto de ubicación del componente padre
  @Input() location: any; 

  // URL de la imagen fija de Google Maps
  mapImageUrl: string = 'https://guias.donweb.com/wp-content/uploads/2023/09/google-maps.jpg';

  constructor() { }

  // Función de ejemplo para el futuro
  onEditLocation(): void {
    console.log('Se ha pulsado editar para:', this.location.name);
    // Aquí se emitirá un evento (editLocation) más adelante.
  }
}