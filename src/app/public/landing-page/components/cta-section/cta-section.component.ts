import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <section class="cta-section">
      <div class="cta-container">
        <h2 class="cta-title">¿Perdiste una mascota?</h2>
        <p class="cta-subtitle">No esperes más, crea una alerta ahora y obtén ayuda de la comunidad</p>

    

        <p class="cta-footer"><i class="pi pi-star"></i> 100% gratis · Privacidad garantizada</p>
      </div>
    </section>
  `,
  styles: [`
    .cta-section {
      background: linear-gradient(135deg, #294374 0%, #1e3050 100%);
      padding: 80px 20px;
      text-align: center;
      color: white;
      animation: fadeIn 0.8s ease-out;
    }

    .cta-container {
      max-width: 700px;
      margin: 0 auto;
    }

    .cta-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 15px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }

    .cta-subtitle {
      font-size: 1.2rem;
      margin-bottom: 40px;
      opacity: 0.95;
      line-height: 1.6;
    }

    .cta-buttons {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 30px;
    }

    .cta-btn {
      border-radius: 12px;
      padding: 14px 28px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.25s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
      border: 2px solid transparent;
      min-width: 190px;
    }

    .cta-btn-primary {
      background: white;
      color: #294374;
      border-color: white;
    }

    .cta-btn-primary:hover {
      background: #f0f0f0;
      border-color: #f0f0f0;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
    }

    .cta-btn-secondary {
      background: transparent;
      color: white;
      border-color: white;
    }

    .cta-btn-secondary:hover {
      background: rgba(255, 255, 255, 0.12);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
    }

    .cta-footer {
      font-size: 0.95rem;
      opacity: 0.9;
      margin: 0;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .cta-footer i {
      color: white;
      font-size: 1rem;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .cta-section {
        padding: 40px 20px;
      }

      .cta-title {
        font-size: 2rem;
      }

      .cta-subtitle {
        font-size: 1rem;
      }

      .cta-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class CtaSectionComponent {
  constructor(private router: Router) {}

  createAlert(): void {
    this.router.navigate(['/app/alerts']);
  }

  viewAlerts(): void {
    this.router.navigate(['/app']);
  }
}
