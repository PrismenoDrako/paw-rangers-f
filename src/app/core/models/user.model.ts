export interface User {
  id: number;
  email: string;
  name: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  phone?: string;
  documentId?: string;
  docNumber?: string;
  docType?: { id: number; name: string };
  docTypeId?: number;
  address?: string;
  profileImage?: string;
  roles?: string[];
  roleId?: number;
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
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  name: string;
  lastName1: string;
  lastName2?: string;
  docTypeId: number;
  docNumber: string;
  address?: string;
}

export interface DocType {
  id: number;
  name: string;
  description: string;
  length: number;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}
