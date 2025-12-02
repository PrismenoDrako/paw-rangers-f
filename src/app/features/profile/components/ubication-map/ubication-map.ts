import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-ubication-map',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './ubication-map.html',
  styleUrl: './ubication-map.scss'
})
export class UbicationMapComponent {
  @Output() locationSelected = new EventEmitter<{ latitude: number; longitude: number; address: string }>();

  onMapClick(): void {
    console.log('Mapa interactivo - seleccionar ubicación');
  }
}
