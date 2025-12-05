import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertsService } from '../../services/alerts.service';
import { Alert } from '../../models/alert.model';
import { AlertMapComponent } from '../../components/alert-map/alert-map';
import { AlertTimelineComponent } from '../../components/alert-timeline/alert-timeline';
import { LostContactModal } from '../../../lost-pets/components/contact-modal/contact-modal';
import { LostPet } from '../../../lost-pets/components/lost-pet-card/lost-pet-card';

@Component({
  selector: 'app-alert-detail',
  standalone: true,
  imports: [
    CommonModule,
    AlertMapComponent,
    AlertTimelineComponent,
    LostContactModal
  ],
  templateUrl: './alert-detail.html',
  styleUrls: ['./alert-detail.scss']
})
export class AlertDetailComponent {
  alert: Alert | undefined;
  timelineMarkers: { lat: number; lng: number; label?: string }[] = [];
  showContactModal = false;
  contactPet: LostPet | null = null;
  contactButtonLabel = 'Contactar';
  showStatusMenu = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertsService: AlertsService
  ) {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.alert = this.alertsService.getAlertById(id);
    if (this.alert?.timeline) {
      this.timelineMarkers = this.alert.timeline
        .filter((e) => !!e.location)
        .map((e) => ({
          lat: e.location!.lat,
          lng: e.location!.lng,
          label: e.location!.label
        }));
    }

    if (this.alert?.reportType === 'lost' && this.alert.ownerContact) {
      this.contactPet = this.mapAlertToLostPet(this.alert);
      const name = this.contactPet.contactInfo.name;
      this.contactButtonLabel = name ? `Contactar a ${name}` : 'Contactar al dueño';
    }
  }

  goToReport(): void {
    if (!this.alert) return;
    if (this.alert.reportType === 'lost' && this.contactPet) {
      this.showContactModal = true;
      return;
    }

    const base = this.alert.reportType === 'lost' ? '/animales-perdidos' : '/animales-encontrados';
    this.router.navigate([base], { queryParams: { ref: this.alert.reportId } });
  }

  markResolved(): void {
    // Mock: marcar como resuelta no cambia backend; sólo navegamos.
    this.router.navigate(['/notificaciones']);
    this.showStatusMenu = false;
  }

  backToNotifications(): void {
    this.router.navigate(['/notificaciones']);
  }

  closeContactModal(): void {
    this.showContactModal = false;
  }

  callOwner(pet: LostPet): void {
    const telLink = `tel:${pet.contactInfo.phone}`;
    window.open(telLink, '_self');
  }

  openInMap(): void {
    if (this.alert) {
      this.router.navigate(['/mapa'], { queryParams: { focus: this.alert.id } });
    }
  }

  contactOwner(): void {
    if (this.contactPet) {
      this.callOwner(this.contactPet);
    }
  }

  toggleStatusMenu(): void {
    this.showStatusMenu = !this.showStatusMenu;
  }

  markInFollowUp(): void {
    // Estado alternativo de ejemplo
    this.showStatusMenu = false;
  }

  private mapAlertToLostPet(alert: Alert): LostPet {
    return {
      id: Number(alert.reportId) || 0,
      name: alert.title.replace(/Mascota perdida:\s*/i, '').trim() || alert.title,
      type: 'Mascota',
      breed: 'No especificado',
      description: alert.description,
      location: alert.location || (alert.lastSeen?.label ?? 'Sin ubicación'),
      lostDate: new Date(alert.createdAt),
      image: alert.image || alert.referenceImage || '',
      reward: undefined,
      contactInfo: {
        name: alert.ownerContact?.name || 'Contacto',
        phone: alert.ownerContact?.phone || '',
        email: alert.ownerContact?.email
      }
    };
  }
}
