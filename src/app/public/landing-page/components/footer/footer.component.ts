import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-logo-container">
            <img src="assets/img/logo-full.png" alt="Paw Rangers Logo" class="footer-logo">
          </div>
          <h4>Paw Rangers</h4>
          <p>Reuniendo mascotas con sus familias</p>
          <div class="social-links">
            <a href="https://instagram.com" target="_blank" title="Instagram">
              <i class="pi pi-instagram"></i>
            </a>
            <a href="https://whatsapp.com" target="_blank" title="WhatsApp">
              <i class="pi pi-whatsapp"></i>
            </a>
            <a href="https://facebook.com" target="_blank" title="Facebook">
              <i class="pi pi-facebook"></i>
            </a>
          </div>
        </div>

        <div class="footer-section">
          <h4>Navegación</h4>
          <ul>
            <li><a (click)="viewAlerts()">Ver alertas</a></li>
            <li><a (click)="navigate('/app/home')">Dashboard</a></li>
            <li><a (click)="navigate('/auth/login')">Inicia sesión</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Términos de uso</a></li>
            <li><a href="#">Privacidad</a></li>
            <li><a href="#">Contacto</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>¿Necesitas ayuda?</h4>
          <p class="contact-row">
            <i class="pi pi-envelope"></i>
            <span>support@pawrangers.com</span>
          </p>
          <p class="contact-row">
            <i class="pi pi-phone"></i>
            <span>+51 978 542 628</span>
          </p>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2025 Paw Rangers. Todos los derechos reservados.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #1e3050;
      color: #ecf0f1;
      padding: 60px 20px 20px;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 40px;
      margin-bottom: 30px;
    }

    .footer-section h4 {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 15px;
      color: #fff;
    }

    .footer-logo-container {
      margin-bottom: 15px;
    }

    .footer-logo {
      height: 50px;
      width: 50px;
      background: white;
      border-radius: 50%;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .footer-section p {
      color: #bdc3c7;
      font-size: 0.95rem;
      line-height: 1.6;
      margin: 5px 0;
    }

    .contact-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .contact-row i {
      color: #bdc3c7;
      font-size: 1rem;
    }

    .footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-section ul li {
      margin-bottom: 10px;
    }

    .footer-section a {
      color: #bdc3c7;
      text-decoration: none;
      transition: color 0.3s ease;
      cursor: pointer;
    }

    .footer-section a:hover {
      color: #294374;
    }

    .social-links {
      display: flex;
      gap: 15px;
      margin-top: 15px;
    }

    .social-links a {
      font-size: 1.5rem;
      display: inline-block;
      transition: transform 0.3s ease, color 0.3s ease;
      color: white;
    }

    .social-links i {
      color: inherit;
    }

    .social-links a:hover {
      transform: scale(1.2);
      color: #dfe6ee;
    }

    .footer-bottom {
      border-top: 1px solid #34495e;
      padding-top: 20px;
      text-align: center;
      color: #95a5a6;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .footer {
        padding: 40px 20px 20px;
      }

      .footer-content {
        gap: 30px;
      }
    }
  `]
})
export class FooterComponent {
  constructor(private router: Router) {}

  viewAlerts(): void {
    this.router.navigate(['/app/home']);
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
