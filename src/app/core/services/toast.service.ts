import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // ms, 0 = no auto-close
  action?: {
    label: string;
    callback: () => void;
  };
  data?: any; // Datos adicionales (ej: notificación completa)
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  constructor() {}

  /**
   * Muestra un toast
   */
  show(toast: Omit<Toast, 'id'>): string {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = { ...toast, id };
    
    const current = this.toastsSubject.value;
    this.toastsSubject.next([...current, newToast]);

    // Auto-cerrar si tiene duración
    if (toast.duration !== 0) {
      const duration = toast.duration || 5000;
      setTimeout(() => this.dismiss(id), duration);
    }

    return id;
  }

  /**
   * Cierra un toast
   */
  dismiss(id: string): void {
    const current = this.toastsSubject.value;
    this.toastsSubject.next(current.filter(t => t.id !== id));
  }

  /**
   * Cierra todos los toasts
   */
  dismissAll(): void {
    this.toastsSubject.next([]);
  }

  /**
   * Toast de éxito
   */
  success(title: string, message: string, duration?: number): string {
    return this.show({ title, message, type: 'success', duration });
  }

  /**
   * Toast de error
   */
  error(title: string, message: string, duration?: number): string {
    return this.show({ title, message, type: 'error', duration });
  }

  /**
   * Toast de información
   */
  info(title: string, message: string, duration?: number): string {
    return this.show({ title, message, type: 'info', duration });
  }

  /**
   * Toast de advertencia
   */
  warning(title: string, message: string, duration?: number): string {
    return this.show({ title, message, type: 'warning', duration });
  }
}
