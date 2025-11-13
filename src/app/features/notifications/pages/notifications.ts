import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { NotificationFooterComponent } from '../components/notification-footer/notification-footer';
import { NotificationHeaderComponent } from '../components/notification-header/notification-header';
import { NotificationItemComponent } from '../components/notification-item/notification-item';
import { NotificationPreferences, NotificationPreferencesService } from '../services/notification-preferences.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, NotificationHeaderComponent, NotificationItemComponent, NotificationFooterComponent],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.scss']
})
export class NotificationsComponent implements OnDestroy {
  petNotifications = [
    {
      message: 'Mascota Perdida Cerca',
      context: 'Luna, una gata gris, fue vista por última vez cerca del parque central.',
      image: 'https://cdn0.uncomo.com/es/posts/4/6/4/mau_egipcio_53464_1_600.jpg',
      timestamp: 'Hace 3 minutos',
      type: 'mascota',
      category: 'alert'
    },
    {
      message: 'Mascota Encontrada',
      context: 'Vecinos reportan haber encontrado a Rocky en la clínica veterinaria del barrio.',
      image: 'https://i.pinimg.com/736x/74/a4/92/74a492bb7b8e5293a3be5e145fdfaf63.jpg',
      timestamp: 'Hace 1 hora',
      type: 'mascota',
      category: 'found'
    }
  ];

  forumNotifications = [
    {
      message: 'Nuevo like',
      context: 'Tu publicación “Tips para rescatar gatitos” recibió un nuevo me gusta.',
      image: 'like.png',
      timestamp: 'Hace 2 minutos',
      type: 'foro',
      category: 'like'
    },
    {
      message: 'Nueva Respuesta',
      context: 'María comentó tu guía para crear campañas de búsqueda efectivas.',
      image: 'reply.png',
      timestamp: 'Hace 5 horas',
      type: 'foro',
      category: 'reply'
    }
  ];

  preferences: NotificationPreferences = { mascotas: true, foro: true };
  private subscription: Subscription;

  constructor(private preferencesService: NotificationPreferencesService) {
    this.preferences = this.preferencesService.currentPreferences;
    this.subscription = this.preferencesService.preferences$.subscribe((prefs) => {
      this.preferences = prefs;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get totalNotifications(): number {
    let total = 0;
    if (this.preferences.mascotas) {
      total += this.petNotifications.length;
    }
    if (this.preferences.foro) {
      total += this.forumNotifications.length;
    }
    return total;
  }

  get showPets(): boolean {
    return this.preferences.mascotas && this.petNotifications.length > 0;
  }

  get showForum(): boolean {
    return this.preferences.foro && this.forumNotifications.length > 0;
  }

  get allNotificationsDisabled(): boolean {
    return !this.preferences.mascotas && !this.preferences.foro;
  }
}
