import { Injectable } from '@angular/core';
import { AlertsService } from '../../alerts/services/alerts.service';
import { MapReportMarker } from '../components/full-map/full-map';

@Injectable({ providedIn: 'root' })
export class MapExplorerService {
  constructor(private alertsService: AlertsService) {}

  getMarkers(): MapReportMarker[] {
    const alerts = this.alertsService.getAll().map<MapReportMarker>((alert) => ({
      id: alert.id,
      type: 'alert',
      title: alert.title,
      subtitle: alert.lastSeen?.label || alert.location,
      lat: alert.lastSeen?.lat ?? 0,
      lng: alert.lastSeen?.lng ?? 0,
      radiusMeters: alert.lastSeen?.radiusMeters,
      route: `/alertas/${alert.id}`
    }));

    const lostPets: MapReportMarker[] = [
      {
        id: 'lost-101',
        type: 'lost',
        title: 'Luna (Gato)',
        subtitle: 'Parque central - Perdido hace 19 dias',
        lat: -5.1985,
        lng: -80.6264,
        radiusMeters: 180,
        route: '/animales-perdidos?ref=101'
      },
      {
        id: 'lost-1',
        type: 'lost',
        title: 'Zeus (Perro)',
        subtitle: 'Centro - Perdido hace 2 horas',
        lat: -5.1972,
        lng: -80.6231,
        radiusMeters: 150,
        route: '/animales-perdidos?ref=1'
      },
      {
        id: 'lost-2',
        type: 'lost',
        title: 'Naranjo (Gato)',
        subtitle: 'Zona Norte - Perdido hace 1 dia',
        lat: -5.1915,
        lng: -80.629,
        radiusMeters: 150,
        route: '/animales-perdidos?ref=2'
      },
      {
        id: 'lost-3',
        type: 'lost',
        title: 'Luna (Perro)',
        subtitle: 'Surco - Perdido hace 6 horas',
        lat: -5.205,
        lng: -80.6335,
        radiusMeters: 150,
        route: '/animales-perdidos?ref=3'
      },
      {
        id: 'lost-4',
        type: 'lost',
        title: 'Mishka (Gato)',
        subtitle: 'Miraflores - Perdido hace 3 dias',
        lat: -5.189,
        lng: -80.6212,
        radiusMeters: 150,
        route: '/animales-perdidos?ref=4'
      }
    ];

    const foundPets: MapReportMarker[] = [
      {
        id: 'found-201',
        type: 'found',
        title: 'Rocky (Perro)',
        subtitle: 'Clinica veterinaria del barrio',
        lat: -5.1945,
        lng: -80.6325,
        radiusMeters: 120,
        route: '/animales-encontrados?ref=201'
      },
      {
        id: 'found-1',
        type: 'found',
        title: 'Perro mestizo',
        subtitle: 'Parque Central - 2 horas atras',
        lat: -5.2006,
        lng: -80.6265,
        radiusMeters: 120,
        route: '/animales-encontrados?ref=1'
      },
      {
        id: 'found-2',
        type: 'found',
        title: 'Gato siames',
        subtitle: 'Av. Principal - 5 horas atras',
        lat: -5.2022,
        lng: -80.6299,
        radiusMeters: 120,
        route: '/animales-encontrados?ref=2'
      },
      {
        id: 'found-3',
        type: 'found',
        title: 'Perrito pequeno',
        subtitle: 'Zona Este - 8 horas atras',
        lat: -5.196,
        lng: -80.6185,
        radiusMeters: 120,
        route: '/animales-encontrados?ref=3'
      }
    ];

    return [...alerts, ...lostPets, ...foundPets];
  }
}
