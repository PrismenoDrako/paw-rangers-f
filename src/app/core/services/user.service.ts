import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User, UserProfile } from '../models/user.model';
import { ApiResponse } from '../models/pet.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly endpoints = {
    profile: 'api/users/profile',
    profileImage: 'api/users/profile/image',
    lostPets: 'api/users/lost-pets',
    foundPets: 'api/users/found-pets',
    changePassword: 'api/users/change-password'
  };

  constructor(private apiService: ApiService) {}

  /**
   * Obtiene el perfil del usuario actual
   */
  getCurrentUser(): Observable<ApiResponse<UserProfile>> {
    return this.apiService.get<ApiResponse<UserProfile>>(this.endpoints.profile);
  }

  /**
   * Actualiza el perfil del usuario
   */
  updateProfile(data: Partial<UserProfile>): Observable<ApiResponse<UserProfile>> {
    return this.apiService.put<ApiResponse<UserProfile>>(this.endpoints.profile, data);
  }

  /**
   * Sube una foto de perfil
   */
  uploadProfileImage(file: File): Observable<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('image', file);
    return this.apiService.post<ApiResponse<{ url: string }>>(this.endpoints.profileImage, formData);
  }

  /**
   * Obtiene las mascotas perdidas del usuario
   */
  getUserLostPets(): Observable<ApiResponse<any[]>> {
    return this.apiService.get<ApiResponse<any[]>>(this.endpoints.lostPets);
  }

  /**
   * Obtiene las mascotas encontradas reportadas por el usuario
   */
  getUserFoundPets(): Observable<ApiResponse<any[]>> {
    return this.apiService.get<ApiResponse<any[]>>(this.endpoints.foundPets);
  }

  /**
   * Cambia la contraseña del usuario
   */
  changePassword(currentPassword: string, newPassword: string): Observable<ApiResponse<void>> {
    return this.apiService.post<ApiResponse<void>>(this.endpoints.changePassword, {
      currentPassword,
      newPassword
    });
  }

  /**
   * Elimina la cuenta del usuario
   */
  deleteAccount(): Observable<ApiResponse<void>> {
    return this.apiService.delete<ApiResponse<void>>(this.endpoints.profile);
  }
}
