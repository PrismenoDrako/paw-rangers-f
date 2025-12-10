import { Injectable } from '@angular/core';
import { NotificationItem, NotificationSeed } from '../models/notification.model';

const STORAGE_KEY = 'pawrangers.comunicados';

@Injectable({ providedIn: 'root' })
export class ComunicadosService {
  private seeds: NotificationSeed[] = [
    {
      id: 'com-1',
      message: 'Jornada de adopción este sábado',
      context: 'Adopciones y charlas sobre cuidado responsable en el Parque Central.',
      image: 'adoption.png',
      date: '2025-12-09T09:00:00',
      type: 'foro',
      category: 'evento',
      read: false,
      targetUrl: '/app/eventos/adopcion',
    },
    {
      id: 'com-2',
      message: 'Mantenimiento programado',
      context: 'Ventana de mantenimiento el domingo 00:00 - 01:30. El login puede verse interrumpido.',
      image: 'alert.png',
      date: '2025-12-08T20:00:00',
      type: 'foro',
      category: 'servicio',
      read: false,
      targetUrl: '/app/estado-servicio',
    },
    {
      id: 'com-3',
      message: 'Nueva sección de voluntariado',
      context: 'Apoya en rescates, traslados o eventos de adopción. Completa tu disponibilidad.',
      image: 'community-alert.png',
      date: '2025-12-07T10:00:00',
      type: 'foro',
      category: 'social',
      read: false,
      targetUrl: '/app/voluntariado',
    },
    {
      id: 'com-4',
      message: 'Actualización del perfil de mascotas',
      context: 'Sube más fotos y guarda ubicaciones frecuentes para alertas más rápidas.',
      image: 'photo-update.png',
      date: '2025-12-05T16:00:00',
      type: 'foro',
      category: 'producto',
      read: false,
      targetUrl: '/app/perfil',
    },
  ];

  list(): NotificationItem[] {
    const stored = this.read();
    const now = Date.now();
    return stored
      .filter((c) => {
        const publishAt = (c.payload as any)?.publishAt ?? c.createdAt;
        const firstPublished = (c.payload as any)?.firstPublishedAt ?? null;
        const visibleSince = firstPublished ?? publishAt;
        return visibleSince <= now;
      })
      .map((c) => ({
        ...c,
        timestamp: this.relativeTime(c.createdAt),
      }))
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  create(com: Omit<NotificationItem, 'createdAt' | 'timestamp'> & { date?: string }): NotificationItem {
    const createdAt = new Date(com.date ?? new Date()).getTime();
    const item: NotificationItem = {
      ...com,
      createdAt,
      timestamp: this.relativeTime(createdAt),
    };
    const all = this.read();
    all.push(item);
    this.write(all);
    return item;
  }

  update(id: string, data: Partial<NotificationItem>): NotificationItem | null {
    const all = this.read();
    const idx = all.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    const merged = { ...all[idx], ...data };
    merged.timestamp = this.relativeTime(merged.createdAt);
    all[idx] = merged;
    this.write(all);
    return merged;
  }

  remove(id: string): void {
    const all = this.read().filter((c) => c.id !== id);
    this.write(all);
  }

  private read(): NotificationItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as NotificationItem[];
      const seeded = this.seeds.map((s) => this.buildItem(s));
      this.write(seeded);
      return seeded;
    } catch {
      const seeded = this.seeds.map((s) => this.buildItem(s));
      this.write(seeded);
      return seeded;
    }
  }

  private write(list: NotificationItem[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  private buildItem(seed: NotificationSeed): NotificationItem {
    const createdAt = new Date(seed.date).getTime();
    return {
      ...seed,
      createdAt,
      timestamp: this.relativeTime(createdAt),
    };
  }

  private relativeTime(timestamp: number): string {
    const diffMs = Date.now() - timestamp;
    const diffMinutes = Math.round(diffMs / 60000);
    if (diffMinutes < 1) return 'Hace instantes';
    if (diffMinutes < 60) return `Hace ${diffMinutes} minuto${diffMinutes === 1 ? '' : 's'}`;
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours === 1 ? '' : 's'}`;
    const diffDays = Math.round(diffHours / 24);
    return `Hace ${diffDays} día${diffDays === 1 ? '' : 's'}`;
  }
}
