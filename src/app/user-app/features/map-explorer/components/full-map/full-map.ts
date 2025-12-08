import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

export type MarkerType = 'lost' | 'found' | 'alert';

export interface MapReportMarker {
  id: string;
  type: MarkerType;
  title: string;
  subtitle?: string;
  lat: number;
  lng: number;
  radiusMeters?: number;
  route?: string;
}

const TYPE_COLORS: Record<MarkerType, string> = {
  lost: '#e4572e',
  found: '#2fbf71',
  alert: '#4a57d3'
};

@Component({
  selector: 'app-full-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './full-map.html',
  styleUrls: ['./full-map.scss']
})
export class FullMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() markers: MapReportMarker[] = [];
  @Input() focusId?: string;
  @Output() markerFocused = new EventEmitter<MapReportMarker>();

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  private map?: L.Map;
  private markerLayer?: L.LayerGroup;
  private markerRefs = new Map<string, L.CircleMarker>();
  private lastFocusedId?: string;

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['markers'] && this.map) {
      this.renderMarkers();
    }

    if (changes['focusId'] && this.map) {
      this.focusMarker(changes['focusId'].currentValue);
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = undefined;
    this.markerRefs.clear();
  }

  private initMap(): void {
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }

    const container = this.mapContainer.nativeElement;
    if (!container.offsetWidth || !container.offsetHeight) {
      setTimeout(() => this.initMap(), 50);
      return;
    }

    this.map = L.map(container, {
      attributionControl: false,
      zoomControl: false
    }).setView([-5.2, -80.63], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);

    L.control
      .zoom({
        position: 'topright'
      })
      .addTo(this.map);

    this.renderMarkers();

    setTimeout(() => this.map?.invalidateSize(), 50);
  }

  private renderMarkers(): void {
    if (!this.map) return;

    if (this.markerLayer) {
      this.markerLayer.clearLayers();
    }
    this.markerLayer = L.layerGroup().addTo(this.map);
    this.markerRefs.clear();

    const bounds: L.LatLngExpression[] = [];

    this.markers.forEach((marker) => {
      const color = TYPE_COLORS[marker.type] || '#4a57d3';
      const circle = L.circleMarker([marker.lat, marker.lng], {
        radius: 9,
        color,
        weight: 2,
        fillColor: '#fff',
        fillOpacity: 1
      });

      const popupHtml = `
        <div class="popup">
          <div class="popup__title">${marker.title}</div>
          ${marker.subtitle ? `<div class="popup__subtitle">${marker.subtitle}</div>` : ''}
          <div class="popup__badge" style="background:${color}22;color:${color}"> ${marker.type === 'lost' ? 'Perdido' : marker.type === 'found' ? 'Encontrado' : 'Alerta'} </div>
        </div>
      `;

      circle.bindPopup(popupHtml);
      circle.addTo(this.markerLayer!);
      circle.bringToFront();
      circle.on('click', () => {
        this.focusMarker(marker.id, true);
        this.markerFocused.emit(marker);
      });

      this.markerRefs.set(marker.id, circle);
      bounds.push([marker.lat, marker.lng]);

      if (marker.radiusMeters) {
        L.circle([marker.lat, marker.lng], {
          radius: marker.radiusMeters,
          color,
          fillColor: color,
          fillOpacity: 0.08,
          weight: 1,
          interactive: false
        }).addTo(this.markerLayer!);
      }
    });

    if (bounds.length > 1 && !this.focusId) {
      this.map.fitBounds(L.latLngBounds(bounds as L.LatLngExpression[]), { padding: [32, 32] });
    } else if (bounds.length === 1 && !this.focusId) {
      this.map.setView(bounds[0] as L.LatLngExpression, 15);
    }

    if (this.focusId) {
      this.focusMarker(this.focusId);
    }
  }

  private focusMarker(id?: string, force = false): void {
    if (!id || !this.map) return;
    if (!force && id === this.lastFocusedId) return;

    const marker = this.markers.find((m) => m.id === id);
    if (!marker) return;

    const ref = this.markerRefs.get(id);
    if (ref) {
      ref.openPopup();
      ref.setStyle({ radius: 11 });
    }

    this.map.setView([marker.lat, marker.lng], 16);
    this.lastFocusedId = id;
  }
}
