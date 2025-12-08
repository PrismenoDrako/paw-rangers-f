import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type NotificationPreferences = {
  mascotas: boolean;
  foro: boolean;
};

const STORAGE_KEY = 'pawrangers.notificationPreferences';
const HAS_WINDOW = typeof window !== 'undefined';

@Injectable({
  providedIn: 'root'
})
export class NotificationPreferencesService {
  private readonly preferencesSubject: BehaviorSubject<NotificationPreferences>;

  constructor() {
    const stored = this.readFromStorage();
    this.preferencesSubject = new BehaviorSubject<NotificationPreferences>(stored);
  }

  get preferences$(): Observable<NotificationPreferences> {
    return this.preferencesSubject.asObservable();
  }

  get currentPreferences(): NotificationPreferences {
    return this.preferencesSubject.value;
  }

  updatePreferences(preferences: NotificationPreferences): void {
    this.preferencesSubject.next(preferences);
    if (HAS_WINDOW) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    }
  }

  private readFromStorage(): NotificationPreferences {
    if (!HAS_WINDOW) {
      return { mascotas: true, foro: true };
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (typeof parsed?.mascotas === 'boolean' && typeof parsed?.foro === 'boolean') {
          return parsed;
        }
      } catch {
        return { mascotas: true, foro: true };
      }
    }
    return { mascotas: true, foro: true };
  }
}
