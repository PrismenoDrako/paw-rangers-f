import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { NotificationFooterComponent } from '../components/notification-footer/notification-footer';
import { NotificationHeaderComponent } from '../components/notification-header/notification-header';
import { NotificationItemComponent } from '../components/notification-item/notification-item';
import { NotificationPreferences, NotificationPreferencesService } from '../services/notification-preferences.service';
import { NotificationGroup, NotificationItem, NotificationSeed } from '../models/notification.model';
import { ComunicadosService } from '../services/comunicados.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, NotificationHeaderComponent, NotificationItemComponent, NotificationFooterComponent],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.scss']
})
export class NotificationsComponent implements OnDestroy {
  private readonly footerThreshold = 4;
  private readonly previewLimit = 3;
  private readState = new Set<string>();

  showUnreadOnly = false;
  showAllPets = false;
  showAllForum = false;

  petNotifications: NotificationItem[] = [];
  forumNotifications: NotificationItem[] = [];
  selectedNotification: NotificationItem | null = null;
  showDetail = false;

  preferences: NotificationPreferences = { mascotas: true, foro: true };
  private subscription: Subscription;

  constructor(
    private preferencesService: NotificationPreferencesService,
    private router: Router,
    private comunicadosService: ComunicadosService,
    private auth: AuthService
  ) {
    this.preferences = this.preferencesService.currentPreferences;
    this.subscription = this.preferencesService.preferences$.subscribe((prefs) => {
      this.preferences = prefs;
    });

    // Inicializar datasets luego de que las dependencias están listas
    this.readState = this.loadReadState();
    this.petNotifications = this.createPetNotifications();
    this.forumNotifications = this.comunicadosService.list();
    this.applyReadState(this.petNotifications);
    this.applyReadState(this.forumNotifications);
  }

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  goToComunicadosAdmin(): void {
    this.router.navigate(['/admin/comunicados']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get filteredPetNotifications(): NotificationItem[] {
    return this.filterByRead(this.petNotifications);
  }

  get filteredForumNotifications(): NotificationItem[] {
    return this.filterByRead(this.forumNotifications);
  }

  get petVisibleGroups(): NotificationGroup[] {
    return this.groupByDate(this.visibleList(this.filteredPetNotifications, this.showAllPets));
  }

  get forumVisibleGroups(): NotificationGroup[] {
    return this.groupByDate(this.visibleList(this.filteredForumNotifications, this.showAllForum));
  }

  get shouldShowMorePets(): boolean {
    return this.filteredPetNotifications.length > this.previewLimit;
  }

  get shouldShowMoreForum(): boolean {
    return this.filteredForumNotifications.length > this.previewLimit;
  }

  private visibleList(list: NotificationItem[], showAll: boolean): NotificationItem[] {
    return showAll ? list : list.slice(0, this.previewLimit);
  }

  private filterByRead(list: NotificationItem[]): NotificationItem[] {
    const filtered = this.showUnreadOnly ? list.filter((item) => !item.read) : [...list];
    return filtered.sort((a, b) => b.createdAt - a.createdAt);
  }

  private countUnread(list: NotificationItem[]): number {
    return list.reduce((total, item) => total + (item.read ? 0 : 1), 0);
  }

  get totalNotifications(): number {
    return this.countUnread(this.petNotifications) + this.countUnread(this.forumNotifications);
  }

  get petUnreadCount(): number {
    return this.countUnread(this.petNotifications);
  }

  get forumUnreadCount(): number {
    return this.countUnread(this.forumNotifications);
  }

  get renderedNotificationsCount(): number {
    let total = 0;
    if (this.preferences.mascotas) {
      total += this.filteredPetNotifications.length;
    }
    if (this.preferences.foro) {
      total += this.filteredForumNotifications.length;
    }
    return total;
  }

  get showPets(): boolean {
    return this.preferences.mascotas && this.filteredPetNotifications.length > 0;
  }

  get showForum(): boolean {
    return this.preferences.foro && this.filteredForumNotifications.length > 0;
  }

  get allNotificationsDisabled(): boolean {
    return !this.preferences.mascotas && !this.preferences.foro;
  }

  get showFooterCTA(): boolean {
    return !this.allNotificationsDisabled && this.renderedNotificationsCount <= this.footerThreshold;
  }

  get showSettingsIcon(): boolean {
    return !this.allNotificationsDisabled && !this.showFooterCTA;
  }

  toggleUnreadFilter(): void {
    this.showUnreadOnly = !this.showUnreadOnly;
    this.showAllPets = false;
    this.showAllForum = false;
  }

  toggleShowAll(section: 'pet' | 'forum'): void {
    if (section === 'pet') {
      this.showAllPets = !this.showAllPets;
    } else {
      this.showAllForum = !this.showAllForum;
    }
  }

  markAsRead(notification: NotificationItem): void {
    if (notification.read) {
      return;
    }

    notification.read = true;
    this.readState.add(notification.id);
    this.saveReadState();
    // Solo las alertas de mascotas se muestran como "Hace instantes" al abrir;
    // los comunicados conservan su tiempo original para no alterar el histórico.
    if (notification.type === 'mascota') {
      notification.timestamp = 'Hace instantes';
    }
  }

  openSettings(): void {
    this.router.navigate(['/app/notification-settings']);
  }

  openNotification(notification: NotificationItem): void {
    this.markAsRead(notification);
    if (notification.type === 'foro') {
      this.selectedNotification = notification;
      this.showDetail = true;
      return;
    }

    if (!notification.targetUrl) {
      return;
    }

    const isExternal = /^https?:\/\//i.test(notification.targetUrl);
    if (isExternal) {
      window.open(notification.targetUrl, '_blank', 'noopener');
      return;
    }

    this.router.navigateByUrl(notification.targetUrl);
  }
  private createPetNotifications(): NotificationItem[] {
    const currentEmail = (this.auth.user()?.email || '').toLowerCase();
    const seeds: NotificationSeed[] = [
      {
        id: 'pet-1',
        message: 'Mascota Perdida Cerca',
        context: 'Luna, una gata gris, fue vista por última vez cerca del parque central.',
        image: 'https://cdn0.uncomo.com/es/posts/4/6/4/mau_egipcio_53464_1_600.jpg',
        date: '2025-11-13T10:24:00',
        type: 'mascota',
        category: 'alert',
        read: true,
        targetUrl: '/app/alertas/lost-1'
      },
      {
        id: 'pet-2',
        message: 'Tu mascota Rocky fue encontrada',
        context: 'Reportan haber encontrado a Rocky en la clínica veterinaria del barrio.',
        image: 'https://i.pinimg.com/736x/74/a4/92/74a492bb7b8e5293a3be5e145fdfaf63.jpg',
        date: '2025-11-13T09:05:00',
        type: 'mascota',
        category: 'found',
        read: true,
        targetUrl: '/app/alertas/found-1',
        ownerEmail: 'raulsema7@gmail.com'
      },
      {
        id: 'pet-6',
        message: 'Nueva alerta comunitaria',
        context: 'Varias personas reportaron haber visto a Milo cerca del río.',
        image: 'community-alert.png',
        date: '2025-11-06T18:30:00',
        type: 'mascota',
        category: 'community_alert',
        read: true,
        targetUrl: '/app/alertas/com-1'
      }
    ];

    return seeds
      .filter((seed) => !seed.ownerEmail || seed.ownerEmail.toLowerCase() === currentEmail)
      .map((seed) => this.buildNotification(seed));
  }

  private createForumNotifications(): NotificationItem[] {
    return this.comunicadosService.list();
  }

  private buildNotification(seed: NotificationSeed): NotificationItem {
    const createdAt = new Date(seed.date).getTime();
    return {
      ...seed,
      createdAt,
      timestamp: this.getRelativeTime(createdAt)
    };
  }

  private groupByDate(list: NotificationItem[]): NotificationGroup[] {
    const groups = new Map<string, NotificationItem[]>();

    list.forEach((item) => {
      const label = this.getDateLabel(item.createdAt);
      if (!groups.has(label)) {
        groups.set(label, []);
      }
      groups.get(label)!.push(item);
    });

    return Array.from(groups.entries()).map(([label, items]) => ({
      label,
      items: items.sort((a, b) => b.createdAt - a.createdAt)
    }));
  }

  private getDateLabel(timestamp: number): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const date = new Date(timestamp);

    if (date >= today) {
      return 'Hoy';
    }
    if (date >= yesterday) {
      return 'Ayer';
    }

    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long'
    });
  }

  private getRelativeTime(timestamp: number): string {
    const diffMs = Date.now() - timestamp;
    const diffMinutes = Math.round(diffMs / 60000);

    if (diffMinutes < 1) {
      return 'Hace instantes';
    }
    if (diffMinutes < 60) {
      return `Hace ${diffMinutes} minuto${diffMinutes === 1 ? '' : 's'}`;
    }

    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) {
      return `Hace ${diffHours} hora${diffHours === 1 ? '' : 's'}`;
    }

    const diffDays = Math.round(diffHours / 24);
    return `Hace ${diffDays} día${diffDays === 1 ? '' : 's'}`;
  }

  private applyReadState(list: NotificationItem[]): void {
    list.forEach((item) => {
      if (this.readState.has(item.id)) {
        item.read = true;
      }
    });
  }

  private storageKey(): string {
    const email = (this.auth.user()?.email || 'guest').toLowerCase();
    return `pawrangers.notifications.read:${email}`;
  }

  private loadReadState(): Set<string> {
    try {
      const raw = localStorage.getItem(this.storageKey());
      if (!raw) {
        return new Set<string>();
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? new Set<string>(parsed) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  }

  private saveReadState(): void {
    try {
      localStorage.setItem(this.storageKey(), JSON.stringify(Array.from(this.readState)));
    } catch {
      // ignore storage errors
    }
  }

  closeDetail(): void {
    this.showDetail = false;
    this.selectedNotification = null;
  }
}
