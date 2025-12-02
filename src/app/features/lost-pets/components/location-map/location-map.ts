import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface LocationData {
  address: string;
  latitude?: number;
  longitude?: number;
}

@Component({
  selector: 'app-location-map',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './location-map.html',
  styleUrls: ['./location-map.scss']
})
export class LocationMap {
  @Output() onLocationUpdate = new EventEmitter<LocationData>();

  locationData: LocationData = {
    address: ''
  };

  onMapClick(): void {
    // Aquí se implementaría la funcionalidad del mapa interactivo
    console.log('Mapa clickeado - implementar selector de ubicación');
  }

  onLocationChange(): void {
    this.onLocationUpdate.emit(this.locationData);
  }
}