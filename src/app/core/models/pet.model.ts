// Modelo base para mascotas
export interface Pet {
  id: number;
  type: string;
  breed: string;
  color: string;
  location: string;
  date: Date;
  image: string;
  description: string;
}

// Modelo para mascotas perdidas
export interface LostPet extends Pet {
  name: string;
  reward: number;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  lastSeenLocation?: string;
  characteristics?: string[];
  status?: 'active' | 'found' | 'inactive';
}

// Modelo para mascotas encontradas
export interface FoundPet extends Pet {
  contactName: string;
  contactPhone?: string;
  contactEmail?: string;
  shelterLocation?: string;
  status?: 'available' | 'claimed' | 'adopted';
}

// DTOs para crear/actualizar mascotas
export interface CreateLostPetDto {
  name: string;
  type: string;
  breed: string;
  color: string;
  location: string;
  lastSeenLocation: string;
  date: Date;
  reward?: number;
  image?: string;
  description: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail?: string;
  characteristics?: string[];
}

export interface CreateFoundPetDto {
  type: string;
  breed: string;
  color: string;
  location: string;
  date: Date;
  image?: string;
  description: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  shelterLocation?: string;
}

// Respuestas de la API
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
