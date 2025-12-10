export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  documentId?: string;
  address?: string;
  profileImage?: string;
  roles?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  address?: string;
  city?: string;
  registeredPets?: number;
  foundPets?: number;
  lostPets?: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  phone?: string;
  documentId?: string;
  address?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}
