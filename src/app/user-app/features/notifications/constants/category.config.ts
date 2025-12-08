export type NotificationCategory =
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

export interface CategoryConfig {
  key: NotificationCategory;
  label: string;
  pillClass: string;
  icon: 'alert' | 'found' | 'like' | 'reply' | 'mention' | 'clock';
  // Ruta opcional a un PNG para icono principal o pildora.
  iconImage?: string;
}

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  alert: {
    key: 'alert',
    label: 'Alerta',
    pillClass: 'meta-pill--alert',
    icon: 'alert'
  },
  found: {
    key: 'found',
    label: 'Encontrada',
    pillClass: 'meta-pill--found',
    icon: 'found'
  },
  like: {
    key: 'like',
    label: 'Like',
    pillClass: 'meta-pill--neutral',
    icon: 'like',
    iconImage: 'like.png'
  },
  reply: {
    key: 'reply',
    label: 'Respuesta',
    pillClass: 'meta-pill--neutral',
    icon: 'reply',
    iconImage: 'reply.png'
  },
  mention: {
    key: 'mention',
    label: 'Mención',
    pillClass: 'meta-pill--neutral',
    icon: 'mention',
    iconImage: 'mention.png'
  },
  summary: {
    key: 'summary',
    label: 'Resumen semanal',
    pillClass: 'meta-pill--neutral',
    icon: 'clock',
    iconImage: 'summary.png'
  },
  message: {
    key: 'message',
    label: 'Mensaje directo',
    pillClass: 'meta-pill--neutral',
    icon: 'clock',
    iconImage: 'message.png'
  },
  poll: {
    key: 'poll',
    label: 'Encuesta',
    pillClass: 'meta-pill--neutral',
    icon: 'clock',
    iconImage: 'poll.png'
  },
  adoption: {
    key: 'adoption',
    label: 'Adopción',
    pillClass: 'meta-pill--neutral',
    icon: 'clock',
    iconImage: 'adoption-pill.png'
  },
  treatment: {
    key: 'treatment',
    label: 'Seguimiento',
    pillClass: 'meta-pill--neutral',
    icon: 'clock'
  },
  photo_update: {
    key: 'photo_update',
    label: 'Foto recibida',
    pillClass: 'meta-pill--neutral',
    icon: 'clock',
    iconImage: 'photo-update-pill.png'
  },
  community_alert: {
    key: 'community_alert',
    label: 'Alerta comunitaria',
    pillClass: 'meta-pill--alert',
    icon: 'alert',
    iconImage: 'community-alert-pill.png'
  }
};

export const DEFAULT_CATEGORY_CONFIG: CategoryConfig = {
  key: 'neutral',
  label: 'Actividad',
  pillClass: 'meta-pill--neutral',
  icon: 'clock'
};
