import { Component, Input } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card'; // Usamos Card para el borde y sombra
import { BadgeModule } from 'primeng/badge'; // Opcional, para el ícono de casa/trabajo
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-ubication-list-item', 
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    BadgeModule, // Para el estilo del icono
    TooltipModule
  ],
  templateUrl: './ubication-list-item.html',
  styleUrl: './ubication-list-item.scss' 
})
export class UbicationListItemComponent { 
  
  @Input() location: any; // Recibe el objeto de ubicación
  
  constructor(private router: Router) {}
  
  // Función para devolver el ícono según el nombre de la ubicación (ej. Casa, Trabajo)
  getIcon(): string {
    const name = this.location.name.toLowerCase();
    if (name.includes('casa') || name.includes('hogar')) {
      return 'pi pi-home';
    } else if (name.includes('trabajo') || name.includes('oficina')) {
      return 'pi pi-briefcase';
    }
    return 'pi pi-map-marker';
  }

  onEditLocation(): void {
    this.router.navigate([`/editar-ubicacion/${this.location.id}`]);
  }

  onDeleteLocation(): void {
    console.log('Se ha pulsado eliminar para:', this.location.name);
    // Aquí se emitirá un evento (deleteLocation) más adelante.
  }
}