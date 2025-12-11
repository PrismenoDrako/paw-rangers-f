import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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
    console.log('📍 LocationService.getUserLocations(): Llamando a GET /user-locations');
    return this.http.get<UserLocation[]>(`${this.baseUrl}/user-locations`, {
      withCredentials: true
    }).pipe(
      tap((response) => {
        console.log('📍 LocationService.getUserLocations(): Respuesta recibida:', response);
      })
    );
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
