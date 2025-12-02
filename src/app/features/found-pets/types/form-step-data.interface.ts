export interface FoundPetLocationData {
  address: string;
  reference: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface FormStepData {
  // Paso 1: Información de la mascota encontrada
  name: string;
  species: string;
  breed?: string;
  age: string;
  photo?: string | null;
  description: string;
  
  // Paso 2: Ubicación donde se encontró
  location: FoundPetLocationData;
  
  // Paso 3: Información de contacto
  contactInfo: {
    phone: string;
    email: string;
  };
  additionalInfo?: string;
}