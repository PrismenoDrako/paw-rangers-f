export interface LostPet {
  id: number;
  name: string;
  type: string;
  breed: string;
  description: string;
  location: string;
  lostDate: Date;
  image: string;
  lat?: number;
  lng?: number;
  reward?: number;
  contactInfo: {
    name: string;
    phone: string;
    email?: string;
  };
}
