export interface NotificationItem {
  id: string;
  message: string;
  context: string;
  image?: string;
  ownerEmail?: string;
  timestamp: string;
  createdAt: number;
  type: 'mascota' | 'foro';
  category:
    | 'alert'
    | 'found'
    | 'like'
    | 'reply'
    | 'mention'
    | 'summary'
    | 'message'
    | 'poll'
    | 'adoption'
    | 'treatment'
    | 'photo_update'
    | 'community_alert'
    | string;
  read: boolean;
  targetUrl?: string;
  payload?: Record<string, unknown>;
}

export interface NotificationSeed {
  id: string;
  message: string;
  context: string;
  date: string;
  image?: string;
  ownerEmail?: string;
  type: 'mascota' | 'foro';
  category:
    | 'alert'
    | 'found'
    | 'like'
    | 'reply'
    | 'mention'
    | 'summary'
    | 'message'
    | 'poll'
    | 'adoption'
    | 'treatment'
    | 'photo_update'
    | 'community_alert'
    | string;
  read: boolean;
  targetUrl?: string;
  payload?: Record<string, unknown>;
}

export interface NotificationGroup {
  label: string;
  items: NotificationItem[];
}
