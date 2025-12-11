import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast, ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div 
        *ngFor="let toast of toasts" 
        class="toast" 
        [class]="'toast-' + toast.type"
        [@slideIn]
      >
        <div class="toast-header">
          <span class="toast-title">{{ toast.title }}</span>
          <button 
            class="toast-close" 
            (click)="toastService.dismiss(toast.id)"
            aria-label="Cerrar notificación"
          >
            <i class="pi pi-bell"></i>
          </button>
        </div>
        <p class="toast-message">{{ toast.message }}</p>
        <button 
          *ngIf="toast.action" 
          class="toast-action"
          (click)="toast.action!.callback(); toastService.dismiss(toast.id)"
        >
          {{ toast.action.label }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 400px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .toast {
      background: white;
      border-left: 4px solid #294374;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s ease-out;
    }

    .toast-success {
      border-left-color: #27ae60;
      background: #f0fdf4;
    }

    .toast-error {
      border-left-color: #e74c3c;
      background: #fef2f2;
    }

    .toast-warning {
      border-left-color: #f39c12;
      background: #fffbf0;
    }

    .toast-info {
      border-left-color: #294374;
      background: #f0f7ff;
    }

    .toast-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 8px;
    }

    .toast-title {
      font-weight: 600;
      font-size: 14px;
      color: #1a1a1a;
    }

    .toast-close {
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      font-size: 18px;
      padding: 0;
      margin: -4px -4px 0 0;
      transition: color 0.2s;
    }

    .toast-close:hover {
      color: #333;
    }

    .toast-message {
      font-size: 13px;
      color: #4a4a4a;
      margin: 0 0 8px 0;
      line-height: 1.4;
    }

    .toast-action {
      background: #294374;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
      align-self: flex-start;
    }

    .toast-action:hover {
      background: #1a2f4d;
    }

    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .toast-container {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
      }
    }
  `]
})
export class ToastContainerComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(public toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }
}
