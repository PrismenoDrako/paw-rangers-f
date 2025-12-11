import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  radius?: number;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las ubicaciones del usuario autenticado
   */
  getUserLocations(): Observable<UserLocation[]> {
    return this.http.get<UserLocation[]>(`${this.baseUrl}/user-locations`, {
      withCredentials: true
    });
  }

  /**
   * Crea una nueva ubicación para el usuario autenticado
   */
  createUserLocation(data: { name: string; latitude: number; longitude: number; radius?: number }): Observable<UserLocation> {
    return this.http.post<UserLocation>(`${this.baseUrl}/user-locations`, data, {
      withCredentials: true
    });
  }

  /**
   * Elimina una ubicación por ID
   */
  deleteUserLocation(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/user-locations/${id}`, {
      withCredentials: true
    });
  }
}
