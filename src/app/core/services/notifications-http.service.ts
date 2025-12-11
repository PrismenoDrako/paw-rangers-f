import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Notification {
  id: number;
  userId?: number;
  type?: string;
  title: string;
  message: string;
  url?: string;
  data?: any;
  createdAt: Date;
  isRead: boolean;
  read?: boolean;
}

export interface NotificationsResponse {
  status: string;
  data: {
    data: Notification[];
    total: number;
    page: number;
    size: number;
    totalPages: number;
  };
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsHttpService {
  constructor(private api: ApiService) {}

  /**
   * Obtiene las notificaciones del usuario autenticado con paginacion
   */
  getNotifications(page: number = 1, size: number = 20, isRead?: boolean): Observable<NotificationsResponse> {
    const params: { page: number; size: number; isRead?: boolean } = { page, size };
    if (isRead !== undefined) {
      params.isRead = isRead;
    }
    return this.api.get<NotificationsResponse>('notifications', params);
  }

  /**
   * Marca una notificacionn como leida
   */
  markAsRead(notificationId: number): Observable<Notification> {
    return this.api.patch<Notification>(`notifications/${notificationId}/read`, {});
  }

  /**
   * Elimina todas las notificaciones del usuario
   */
  clearAll(): Observable<NotificationsResponse> {
    return this.api.delete<NotificationsResponse>('notifications');
  }
}
