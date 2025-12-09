import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <section class="hero">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">Paw Rangers</h1>
          <p class="hero-subtitle">Encuentra tu mascota perdida, ayuda otros a encontrar la suya</p>
          <p class="hero-description">Una comunidad dedicada a reunir mascotas perdidas con sus familias</p>
          
          <div class="hero-buttons">
            <button pButton type="button" label="Registrarse gratis" class="p-button-lg hero-btn-secondary" (click)="register()"></button>
          </div>
        </div>

        <div class="hero-image">
          <div class="hero-emoji-container">
            <span class="hero-emoji hero-emoji-top-left">🐶</span>
            <span class="hero-emoji hero-emoji-top-right">🐱</span>
            <span class="hero-emoji hero-emoji-bottom">🐾</span>
            <img src="assets/img/logo-full.png" alt="Paw Rangers Logo" class="hero-center-logo">
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, #294374 0%, #1e3050 100%);
      color: white;
      padding: 64px 20px;
      text-align: center;
    }

    .hero-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      align-items: center;
    }

    .hero-text {
      text-align: left;
      animation: slideInLeft 0.8s ease-out;
    }

    .hero-title {
      font-size: 2.8rem;
      font-weight: 700;
      margin-bottom: 16px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }

    .hero-subtitle {
      font-size: 1.2rem;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .hero-description {
      font-size: 0.88rem;
      margin-bottom: 32px;
      opacity: 0.95;
    }

    .hero-buttons {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }

    .hero-btn-primary {
      background-color: white !important;
      color: #294374 !important;
      border: 2px solid white !important;
      font-weight: 600;
    }

    .hero-btn-primary:hover {
      background-color: #f0f0f0 !important;
      border-color: #f0f0f0 !important;
    }

    .hero-btn-secondary {
      background-color: transparent !important;
      color: white !important;
      border: 2px solid white !important;
      font-weight: 600;
    }

    .hero-btn-secondary:hover {
      background-color: rgba(255, 255, 255, 0.1) !important;
      border-color: white !important;
    }

    .hero-image {
      position: relative;
      height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 400px;
      min-height: 400px;
    }

    .hero-emoji-container {
      position: relative;
      width: 368px;
      height: 368px;
    }

    .hero-emoji {
      position: absolute;
      font-size: 2.32rem;
      filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.22));
      animation: float 4s ease-in-out infinite;
    }

    .hero-emoji-top-left {
      top: 18%;
      left: 3%;
      animation-delay: 0.1s;
    }

    .hero-emoji-top-right {
      top: 8%;
      right: 8%;
      animation-delay: 0.3s;
    }

    .hero-emoji-bottom {
      bottom: 6%;
      left: 22%;
      animation-delay: 0.5s;
    }

    .hero-center-logo {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 256px;
      width: 256px;
      background: white;
      border-radius: 50%;
      padding: 27px;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.32);
      animation: bounceInCentered 0.7s ease-out;
      object-fit: contain;
    }

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes bounceInCentered {
      0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.3);
      }
      50% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.05);
      }
      70% {
        transform: translate(-50%, -50%) scale(0.9);
      }
      100% {
        transform: translate(-50%, -50%) scale(1);
      }
    }

    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }

    @media (max-width: 768px) {
      .hero {
        padding: 40px 20px;
      }

      .hero-content {
        grid-template-columns: 1fr;
        gap: 40px;
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .hero-subtitle {
        font-size: 1.2rem;
      }

      .hero-buttons {
        flex-direction: column;
      }

      .hero-image {
        height: 320px;
        min-height: 320px;
        min-width: 320px;
      }

      .hero-emoji-container {
        width: 300px;
        height: 300px;
      }

      .hero-center-logo {
        height: 220px;
        width: 220px;
        padding: 22px;
      }
    }
  `]
})
export class HeroComponent {
  constructor(private router: Router) {}

  viewAlerts(): void {
    this.router.navigate(['/app/home']);
  }

  register(): void {
    this.router.navigate(['/auth/register']);
  }
}
