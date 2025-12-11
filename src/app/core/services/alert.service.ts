import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface CreateAlertDto {
  speciesId: number;
  breedId?: number;
  description: string;
  latitude: number;
  longitude: number;
  date?: string; // ISO format
  type: 'lost' | 'found';
}

export interface AlertResponse {
  id: number;
  userId: number;
  speciesId: number;
  breedId?: number;
  description: string;
  latitude: number;
  longitude: number;
  date?: string;
  type: 'lost' | 'found';
  stateId: number;
  imageUrls?: string[];
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private readonly baseUrl = 'http://localhost:3000/alerts';
  
  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  createAlert(dto: CreateAlertDto, files?: File[]): Observable<AlertResponse> {
    const formData = new FormData();
    
    // Agregar campos del DTO
    formData.append('speciesId', dto.speciesId.toString());
    if (dto.breedId) {
      formData.append('breedId', dto.breedId.toString());
    }
    formData.append('description', dto.description);
    formData.append('latitude', dto.latitude.toString());
    formData.append('longitude', dto.longitude.toString());
    if (dto.date) {
      formData.append('date', dto.date);
    }
    formData.append('type', dto.type);

    // Agregar archivos si existen
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('images', file);
      });
    }

    return this.http.post<AlertResponse>(
      this.baseUrl,
      formData,
      { withCredentials: true }
    );
  }

  getAlerts(): Observable<{ status: string; data: { data: AlertResponse[]; total: number; page: number; size: number; totalPages: number }; timestamp: string }> {
    return this.http.get<any>(
      this.baseUrl,
      { withCredentials: true }
    );
  }
}
