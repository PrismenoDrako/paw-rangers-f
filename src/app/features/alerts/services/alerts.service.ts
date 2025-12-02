import { Injectable } from '@angular/core';
import { Alert } from '../models/alert.model';

@Injectable({ providedIn: 'root' })
export class AlertsService {
  // Mock inicial; en producción conecta con la API de reportes lost/found.
  private alerts: Alert[] = [
    {
      id: 'com-1',
      title: 'Alerta comunitaria: avistamiento de Milo',
      description: 'Vecinos reportaron haber visto a Milo cerca del río. Revisa el reporte para más detalles.',
      type: 'community',
      status: 'open',
      reportId: 'pet-6',
      reportType: 'lost',
      location: 'Zona del río',
      createdAt: '2025-11-06T18:30:00',
      lastSeen: {
        lat: -5.2001,
        lng: -80.625,
        radiusMeters: 400,
        label: 'Plaza de armas de Piura'
      },
      ownerContact: {
        name: 'Equipo comunitario',
        phone: '+51 999 000 111'
      },
      timeline: [
        {
          id: 'evt-1',
          type: 'sighting',
          title: 'Avistamiento confirmado',
          description: 'Dos vecinos reportaron ver a Milo cerca del puente.',
          timestamp: '2025-11-06T18:30:00',
          location: { lat: -5.2006, lng: -80.6265, label: 'Puente peatonal' }
        },
        {
          id: 'evt-2',
          type: 'status',
          title: 'Equipo de búsqueda notificado',
          timestamp: '2025-11-06T19:00:00'
        }
      ]
    },
    {
      id: 'lost-1',
      title: 'Mascota perdida: Luna',
      description: 'Luna fue vista por última vez cerca del parque central.',
      type: 'lost',
      status: 'open',
      image: 'https://cdn0.uncomo.com/es/posts/4/6/4/mau_egipcio_53464_1_600.jpg',
      referenceImage: 'https://cdn0.uncomo.com/es/posts/4/6/4/mau_egipcio_53464_1_600.jpg',
      reportId: 'pet-1',
      reportType: 'lost',
      location: 'Parque central',
      createdAt: '2025-11-13T10:24:00',
      lastSeen: {
        lat: -5.1982,
        lng: -80.6268,
        radiusMeters: 450,
        label: 'Parque infantil de Piura'
      },
      ownerContact: {
        name: 'Laura González',
        phone: '+51 987 111 222',
        email: 'laura@example.com',
        address: 'Av. Grau 123, Piura'
      },
      timeline: [
        {
          id: 'evt-l1',
          type: 'sighting',
          title: 'Avistamiento inicial',
          description: 'Vecina reporta a Luna rondando la entrada del parque.',
          timestamp: '2025-11-13T10:24:00',
          location: { lat: -5.1982, lng: -80.6268, label: 'Entrada parque' }
        }
      ]
    },
    {
      id: 'found-1',
      title: 'Mascota encontrada: Rocky',
      description: 'Reportaron a Rocky en la clínica veterinaria del barrio.',
      type: 'found',
      status: 'open',
      image: 'https://i.pinimg.com/736x/74/a4/92/74a492bb7b8e5293a3be5e145fdfaf63.jpg',
      referenceImage: 'https://i.pinimg.com/736x/74/a4/92/74a492bb7b8e5293a3be5e145fdfaf63.jpg',
      foundImage: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b',
      reportId: 'pet-2',
      reportType: 'found',
      location: 'Clínica veterinaria central',
      createdAt: '2025-11-13T09:05:00',
      lastSeen: {
        lat: -5.1945,
        lng: -80.6325,
        radiusMeters: 200,
        label: 'Clínica del barrio en Piura'
      },
      finderContact: {
        name: 'Clínica Veterinaria Central',
        phone: '+51 973 555 666',
        email: 'contacto@clinicaveterinaria.pe',
        address: 'Jr. Cusco 345, Piura',
        note: 'Pedir por recepción, horario 9am-6pm'
      },
      timeline: [
        {
          id: 'evt-f1',
          type: 'status',
          title: 'Clínica confirma resguardo',
          description: 'Rocky está en resguardo, a la espera de contacto.',
          timestamp: '2025-11-13T09:30:00',
          location: { lat: -5.1945, lng: -80.6325, label: 'Clínica del barrio en Piura' }
        }
      ]
    }
  ];

  getAll(): Alert[] {
    return [...this.alerts];
  }

  getAlertById(id: string): Alert | undefined {
    return this.alerts.find((item) => item.id === id);
  }
}
