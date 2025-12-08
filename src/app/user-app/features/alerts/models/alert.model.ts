export type AlertType = 'lost' | 'found' | 'community';
export type AlertStatus = 'open' | 'resolved';

export interface AlertEvent {
  id: string;
  type: 'sighting' | 'status';
  title: string;
  description?: string;
  timestamp: string;
  location?: {
    lat: number;
    lng: number;
    label?: string;
  };
}

export interface AlertContact {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  note?: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  type: AlertType;
  status: AlertStatus;
  ownedByCurrentUser?: boolean;
  image?: string;
  referenceImage?: string;
  foundImage?: string;
  reportId: string;
  reportType: 'lost' | 'found';
  location?: string;
  createdAt: string;
  lastSeen?: {
    lat: number;
    lng: number;
    radiusMeters?: number;
    label?: string;
  };
  timeline?: AlertEvent[];
  ownerContact?: AlertContact;
  finderContact?: AlertContact;
}
