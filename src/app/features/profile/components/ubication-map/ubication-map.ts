import { Component, Output, EventEmitter, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import * as L from 'leaflet';

@Component({
  selector: 'app-ubication-map',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  templateUrl: './ubication-map.html',
  styleUrl: './ubication-map.scss'
})
export class UbicationMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapElement', { static: false }) mapElement!: ElementRef;
  @Output() locationSelected = new EventEmitter<{ latitude: number; longitude: number; address: string }>();

  map: L.Map | null = null;
  marker: L.Marker | null = null;
  mapInitialized = false;
  private addressCache: { [key: string]: string } = {};

  // Ubicación por defecto (Lima, Perú)
  defaultLat = -12.0462;
  defaultLng = -77.0369;
  currentLat = this.defaultLat;
  currentLng = this.defaultLng;

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  private initializeMap(): void {
    // Esperar un poco para asegurar que el DOM esté listo
    setTimeout(() => {
      if (this.mapElement?.nativeElement) {
        this.createMap();
      }
    }, 50); // Reducido de 100 a 50ms
  }

  private createMap(): void {
    try {
      // Crear mapa con opciones optimizadas
      this.map = L.map(this.mapElement.nativeElement, {
        zoom: 15,
        center: [this.currentLat, this.currentLng],
        preferCanvas: true,
        zoomControl: true,
        attributionControl: true
      });

      // Agregar capa de tiles (OpenStreetMap) con opciones optimizadas
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        minZoom: 1,
        crossOrigin: 'anonymous',
        detectRetina: true
      }).addTo(this.map);

      // Crear marcador arrastrable
      this.marker = L.marker([this.currentLat, this.currentLng], {
        draggable: true
      }).addTo(this.map);

      // Eventos del marcador
      this.marker.on('dragend', () => {
        this.onMarkerDragEnd();
      });

      // Click en el mapa para crear marcador
      this.map.on('click', (e: L.LeafletMouseEvent) => {
        this.onMapClick(e);
      });

      // Emitir ubicación inicial inmediatamente (sin esperar dirección)
      this.emitLocation(this.currentLat, this.currentLng, 'Ubicación seleccionada');
      
      // Obtener dirección inicial en segundo plano (sin bloquear)
      this.getAddressFromCoordinates(this.currentLat, this.currentLng);
      this.mapInitialized = true;

      // Forzar recalcular el tamaño del mapa después de renderizar
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 100);
    } catch (error) {
      console.error('Error al inicializar el mapa:', error);
    }
  }

  private onMarkerDragEnd(): void {
    if (this.marker) {
      const latLng = this.marker.getLatLng();
      this.currentLat = latLng.lat;
      this.currentLng = latLng.lng;
      
      // Emitir ubicación inmediatamente
      this.emitLocation(this.currentLat, this.currentLng, 'Ubicación seleccionada');
      
      // Obtener dirección en segundo plano
      this.getAddressFromCoordinates(this.currentLat, this.currentLng);
    }
  }

  private onMapClick(e: L.LeafletMouseEvent): void {
    if (this.marker && this.map) {
      const latLng = e.latlng;
      this.marker.setLatLng(latLng);
      this.currentLat = latLng.lat;
      this.currentLng = latLng.lng;
      this.map.setView([this.currentLat, this.currentLng], this.map.getZoom());
      
      // Emitir ubicación inmediatamente
      this.emitLocation(this.currentLat, this.currentLng, 'Ubicación seleccionada');
      
      // Obtener dirección en segundo plano
      this.getAddressFromCoordinates(this.currentLat, this.currentLng);
    }
  }

  private getAddressFromCoordinates(latitude: number, longitude: number): void {
    // Crear clave para caché
    const cacheKey = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    
    // Si ya tenemos esta dirección en caché, usarla
    if (this.addressCache[cacheKey]) {
      this.emitLocation(latitude, longitude, this.addressCache[cacheKey]);
      return;
    }

    // Usar API de Nominatim con timeout corto
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // Timeout de 3 segundos
    
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

    fetch(url, {
      headers: {
        'User-Agent': 'PawRangers-App'
      },
      signal: controller.signal
    })
      .then(response => response.json())
      .then(data => {
        clearTimeout(timeoutId);
        const address = data.address?.road || data.address?.hamlet || data.address?.village || data.address?.city || data.display_name || 'Ubicación seleccionada';
        // Guardar en caché
        this.addressCache[cacheKey] = address;
        this.emitLocation(latitude, longitude, address);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        console.error('Error al obtener dirección:', error);
        // En caso de error, usar un nombre genérico
        const fallbackAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        this.addressCache[cacheKey] = fallbackAddress;
        this.emitLocation(latitude, longitude, fallbackAddress);
      });
  }

  private emitLocation(latitude: number, longitude: number, address: string): void {
    this.locationSelected.emit({
      latitude,
      longitude,
      address
    });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
