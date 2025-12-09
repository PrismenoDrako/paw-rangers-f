import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="how-it-works">
      <div class="how-container">
        <h2 class="section-title">¿Cómo funciona?</h2>
        <p class="section-subtitle">3 pasos simples para encontrar tu mascota</p>

        <div class="steps-grid">
          <div class="step" *ngFor="let step of steps; let i = index">
            <div class="step-number">{{ i + 1 }}</div>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-description">{{ step.description }}</p>
            <div [ngClass]="step.icon" class="step-icon"></div>
            
            <div *ngIf="i < steps.length - 1" class="arrow">
              <span class="arrow-text">→</span>
            </div>
          </div>
        </div>

        <div class="timeline-mobile">
          <div *ngFor="let step of steps; let i = index" class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <h4>{{ i + 1 }}. {{ step.title }}</h4>
              <p>{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .how-it-works {
      padding: 80px 20px;
      background: linear-gradient(135deg, rgba(41, 67, 116, 0.05) 0%, rgba(30, 48, 80, 0.05) 100%);
    }

    .how-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 15px;
      color: #294374;
    }

    .section-subtitle {
      font-size: 1.1rem;
      text-align: center;
      color: #666;
      margin-bottom: 60px;
    }

    .steps-grid {
      display: none;
    }

    .steps-grid {
      @media (min-width: 769px) {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 30px;
        align-items: center;
      }
    }

    .step {
      background: white;
      padding: 40px 30px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
      position: relative;
      animation: slideInUp 0.6s ease-out;
      transition: all 0.3s ease;
    }

    @media (min-width: 769px) {
      .steps-grid {
        display: grid;
      }
    }

    .step:hover {
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
      transform: translateY(-5px);
    }

    .step-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #294374 0%, #1e3050 100%);
      color: white;
      border-radius: 50%;
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 20px;
    }

    .step-title {
      font-size: 1.3rem;
      font-weight: 600;
      margin-bottom: 15px;
      color: #294374;
    }

    .step-description {
      font-size: 1rem;
      color: #666;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .step-icon {
      font-size: 3rem;
      color: #294374;
    }

    .arrow {
      position: absolute;
      right: -45px;
      top: 50%;
      transform: translateY(-50%);
      display: none;
    }

    @media (min-width: 769px) {
      .arrow {
        display: block;
      }
    }

    .arrow-text {
      font-size: 2.5rem;
      color: #294374;
      font-weight: 700;
      animation: bounce 2s ease-in-out infinite;
    }

    .timeline-mobile {
      display: block;
    }

    @media (min-width: 769px) {
      .timeline-mobile {
        display: none;
      }
    }

    .timeline-item {
      display: flex;
      margin-bottom: 30px;
      animation: fadeInLeft 0.6s ease-out;
    }

    .timeline-dot {
      width: 30px;
      height: 30px;
      background: linear-gradient(135deg, #294374 0%, #1e3050 100%);
      border-radius: 50%;
      margin-right: 20px;
      flex-shrink: 0;
      position: relative;
      top: 5px;
    }

    .timeline-content h4 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 1.1rem;
    }

    .timeline-content p {
      margin: 0;
      color: #666;
      font-size: 0.95rem;
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInLeft {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes bounce {
      0%, 100% {
        transform: translateX(0);
      }
      50% {
        transform: translateX(10px);
      }
    }

    @media (max-width: 768px) {
      .how-it-works {
        padding: 40px 20px;
      }

      .section-title {
        font-size: 2rem;
      }
    }
  `]
})
export class HowItWorksComponent {
  steps = [
    {
      icon: 'pi pi-id-card',
      title: 'Registrate gratis',
      description: 'Crea una cuenta en segundos con tu email o redes sociales'
    },
    {
      icon: 'pi pi-cloud-upload',
      title: 'Reporta tu mascota',
      description: 'Sube fotos, descripción y ubicación de donde se perdió'
    },
    {
      icon: 'pi pi-check-circle',
      title: 'Recibe alertas',
      description: 'La comunidad te ayuda a encontrar tu mascota rápidamente'
    }
  ];
}
