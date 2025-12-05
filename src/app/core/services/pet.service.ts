import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  LostPet,
  FoundPet,
  CreateLostPetDto,
  CreateFoundPetDto,
  PaginatedResponse,
  ApiResponse
} from '../models/pet.model';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private readonly endpoints = {
    lost: 'api/pets/lost',
    found: 'api/pets/found',
    upload: 'api/pets/upload'
  };

  constructor(private apiService: ApiService) {}

  // ==================== MASCOTAS PERDIDAS ====================
  
  /**
   * Obtiene todas las mascotas perdidas con paginación
   */
  getLostPets(page: number = 1, limit: number = 10, filters?: any): Observable<PaginatedResponse<LostPet>> {
    const params = { page, limit, ...filters };
    return this.apiService.get<PaginatedResponse<LostPet>>(this.endpoints.lost, params);
  }

  /**
   * Obtiene una mascota perdida por ID
   */
  getLostPetById(id: number): Observable<ApiResponse<LostPet>> {
    return this.apiService.get<ApiResponse<LostPet>>(`${this.endpoints.lost}/${id}`);
  }

  /**
   * Crea un reporte de mascota perdida
   */
  createLostPet(data: CreateLostPetDto): Observable<ApiResponse<LostPet>> {
    return this.apiService.post<ApiResponse<LostPet>>(this.endpoints.lost, data);
  }

  /**
   * Actualiza un reporte de mascota perdida
   */
  updateLostPet(id: number, data: Partial<CreateLostPetDto>): Observable<ApiResponse<LostPet>> {
    return this.apiService.put<ApiResponse<LostPet>>(`${this.endpoints.lost}/${id}`, data);
  }

  /**
   * Elimina un reporte de mascota perdida
   */
  deleteLostPet(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<ApiResponse<void>>(`${this.endpoints.lost}/${id}`);
  }

  /**
   * Marca una mascota perdida como encontrada
   */
  markAsFound(id: number): Observable<ApiResponse<LostPet>> {
    return this.apiService.put<ApiResponse<LostPet>>(`${this.endpoints.lost}/${id}/found`, {});
  }

  // ==================== MASCOTAS ENCONTRADAS ====================
  
  /**
   * Obtiene todas las mascotas encontradas con paginación
   */
  getFoundPets(page: number = 1, limit: number = 10, filters?: any): Observable<PaginatedResponse<FoundPet>> {
    const params = { page, limit, ...filters };
    return this.apiService.get<PaginatedResponse<FoundPet>>(this.endpoints.found, params);
  }

  /**
   * Obtiene una mascota encontrada por ID
   */
  getFoundPetById(id: number): Observable<ApiResponse<FoundPet>> {
    return this.apiService.get<ApiResponse<FoundPet>>(`${this.endpoints.found}/${id}`);
  }

  /**
   * Crea un reporte de mascota encontrada
   */
  createFoundPet(data: CreateFoundPetDto): Observable<ApiResponse<FoundPet>> {
    return this.apiService.post<ApiResponse<FoundPet>>(this.endpoints.found, data);
  }

  /**
   * Actualiza un reporte de mascota encontrada
   */
  updateFoundPet(id: number, data: Partial<CreateFoundPetDto>): Observable<ApiResponse<FoundPet>> {
    return this.apiService.put<ApiResponse<FoundPet>>(`${this.endpoints.found}/${id}`, data);
  }

  /**
   * Elimina un reporte de mascota encontrada
   */
  deleteFoundPet(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<ApiResponse<void>>(`${this.endpoints.found}/${id}`);
  }

  /**
   * Marca una mascota encontrada como reclamada
   */
  markAsClaimed(id: number): Observable<ApiResponse<FoundPet>> {
    return this.apiService.put<ApiResponse<FoundPet>>(`${this.endpoints.found}/${id}/claimed`, {});
  }

  // ==================== BÚSQUEDA Y FILTROS ====================
  
  /**
   * Busca mascotas por texto
   */
  searchPets(query: string, type: 'lost' | 'found'): Observable<PaginatedResponse<LostPet | FoundPet>> {
    const endpoint = type === 'lost' ? this.endpoints.lost : this.endpoints.found;
    return this.apiService.get<PaginatedResponse<LostPet | FoundPet>>(`${endpoint}/search`, { q: query });
  }

  /**
   * Obtiene mascotas recientes (para el home)
   */
  getRecentPets(type: 'lost' | 'found', limit: number = 5): Observable<ApiResponse<LostPet[] | FoundPet[]>> {
    const endpoint = type === 'lost' ? this.endpoints.lost : this.endpoints.found;
    return this.apiService.get<ApiResponse<LostPet[] | FoundPet[]>>(`${endpoint}/recent`, { limit });
  }

  // ==================== UPLOAD DE IMÁGENES ====================
  
  /**
   * Sube una imagen de mascota
   */
  uploadImage(file: File): Observable<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('image', file);
    return this.apiService.post<ApiResponse<{ url: string }>>(this.endpoints.upload, formData);
  }
}
