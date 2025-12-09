import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <section class="features">
      <div class="features-container">
        <h2 class="section-title">¿Por qué elegir Paw Rangers?</h2>
        <p class="section-subtitle">Herramientas diseñadas para reunir mascotas con sus familias</p>

        <div class="features-grid">
          <div *ngFor="let feature of features" class="feature-card">
            <div class="feature-icon" [ngClass]="feature.icon"></div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .features {
      padding: 80px 20px;
      background-color: #f8f9fa;
    }

    .features-container {
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

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }

    .feature-card {
      background: white;
      padding: 40px 30px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
      transition: all 0.3s ease;
      animation: fadeInUp 0.6s ease-out;
    }

    .feature-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 12px 24px rgba(41, 67, 116, 0.15);
      border-left: 4px solid #294374;
    }

    .feature-icon {
      font-size: 3.5rem;
      margin-bottom: 20px;
      color: #294374;
    }

    .feature-title {
      font-size: 1.3rem;
      font-weight: 600;
      margin-bottom: 15px;
      color: #294374;
    }

    .feature-description {
      font-size: 1rem;
      color: #666;
      line-height: 1.6;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .features {
        padding: 40px 20px;
      }

      .section-title {
        font-size: 2rem;
      }

      .features-grid {
        gap: 20px;
      }

      .feature-card {
        padding: 30px 20px;
      }
    }
  `]
})
export class FeaturesComponent {
  features = [
    {
      icon: 'pi pi-map-marker',
      title: 'Ubicación en tiempo real',
      description: 'Reporta y visualiza mascotas perdidas en un mapa interactivo con precisión GPS'
    },
    {
      icon: 'pi pi-bell',
      title: 'Alertas instantáneas',
      description: 'Recibe notificaciones cuando se reportan mascotas cerca de ti o en tu zona'
    },
    {
      icon: 'pi pi-users',
      title: 'Comunidad conectada',
      description: 'Únete a una red de personas dispuestas a ayudar a encontrar mascotas'
    },
    {
      icon: 'pi pi-mobile',
      title: 'Fácil de usar',
      description: 'Reporta en segundos con fotos, descripción y detalles de contacto'
    },
    {
      icon: 'pi pi-lock',
      title: 'Seguridad garantizada',
      description: 'Tu información está protegida y compartida solo con quien autorices'
    },
    {
      icon: 'pi pi-bolt',
      title: 'Resultados rápidos',
      description: 'Miles de usuarios listos para ayudar a encontrar tu mascota'
    }
  ];
}
