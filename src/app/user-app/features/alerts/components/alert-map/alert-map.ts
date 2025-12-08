import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import * as L from 'leaflet';

interface MapMarker {
  lat: number;
  lng: number;
  label?: string;
}

@Component({
  selector: 'app-alert-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-map.html',
  styleUrls: ['./alert-map.scss']
})
export class AlertMapComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) center!: { lat: number; lng: number };
  @Input() radiusMeters = 300;
  @Input() markers: MapMarker[] = [];

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  private map?: L.Map;

  ngAfterViewInit(): void {
    // Espera a que el contenedor tenga tamaño real antes de inicializar el mapa
    setTimeout(() => this.initMap(), 0);
  }

  private initMap(): void {
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
    if (!this.center) return;
    const container = this.mapContainer.nativeElement;
    if (!container.offsetWidth || !container.offsetHeight) {
      // Reintenta cuando el contenedor tenga tamaño
      setTimeout(() => this.initMap(), 50);
      return;
    }
    this.map = L.map(container, {
      attributionControl: false
    }).setView([this.center.lat, this.center.lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);

    this.map.whenReady(() => {
      this.map?.invalidateSize();
    });

    // Radio de búsqueda
    L.circle([this.center.lat, this.center.lng], {
      radius: this.radiusMeters,
      color: '#4a57d3',
      fillColor: '#4a57d3',
      fillOpacity: 0.12,
      weight: 2
    }).addTo(this.map);

    // Marcadores de eventos
    const bounds: L.LatLngExpression[] = [[this.center.lat, this.center.lng]];
    this.markers.forEach((m) => {
      const marker = L.circleMarker([m.lat, m.lng], {
        radius: 7,
        color: '#4a57d3',
        weight: 2,
        fillColor: '#fff',
        fillOpacity: 1
      });
      if (m.label) {
        marker.bindPopup(m.label);
      }
      marker.addTo(this.map!);
      bounds.push([m.lat, m.lng]);
    });

    if (bounds.length > 1) {
      this.map.fitBounds(L.latLngBounds(bounds as L.LatLngExpression[]), { padding: [16, 16] });
    }
    // Asegura recalcular tamaño por si el contenedor se pintó tras el render.
    setTimeout(() => this.map?.invalidateSize(), 50);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
