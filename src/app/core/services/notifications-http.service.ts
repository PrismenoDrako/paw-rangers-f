import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private readonly baseUrl = 'http://localhost:3000/notifications';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene las notificaciones del usuario autenticado con paginación
   */
  getNotifications(page: number = 1, size: number = 20, isRead?: boolean): Observable<NotificationsResponse> {
    let url = `${this.baseUrl}?page=${page}&size=${size}`;
    if (isRead !== undefined) {
      url += `&isRead=${isRead}`;
    }
    return this.http.get<NotificationsResponse>(url, {
      withCredentials: true
    });
  }

  /**
   * Marca una notificación como leída
   */
  markAsRead(notificationId: number): Observable<Notification> {
    return this.http.patch<Notification>(
      `${this.baseUrl}/${notificationId}/read`,
      {},
      { withCredentials: true }
    );
  }
}
