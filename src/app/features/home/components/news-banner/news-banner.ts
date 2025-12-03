import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news-banner',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './news-banner.html',
  styleUrl: './news-banner.scss'
})
export class NewsBanner {
  newsItems = [
    {
      id: 1,
      title: 'Cuidado 24/7',
      description: 'Emergencias veterinarias',
      date: new Date('2024-11-28'),
      type: 'feature',
      icon: 'pi-phone',
      buttonText: 'Llamar ahora',
      buttonIcon: 'pi-phone',
      image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&h=400&fit=crop',
      action: 'call'
    },
    {
      id: 2,
      title: '¡Nueva actualización!',
      description: 'Sistema de alertas mejorado para encontrar mascotas más rápido',
      date: new Date('2024-11-25'),
      type: 'update',
      icon: 'pi-star',
      buttonText: 'Ver más',
      buttonIcon: 'pi-arrow-right',
      image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=400&fit=crop',
      action: 'navigate'
    },
    {
      id: 3,
      title: 'Clínica Veterinaria VetPlus',
      description: 'Atención especializada para tu mascota',
      date: new Date('2024-11-20'),
      type: 'ad',
      icon: 'pi-heart',
      buttonText: 'Agendar cita',
      buttonIcon: 'pi-calendar',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
      action: 'contact'
    }
  ];

  currentIndex = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    this.startAutoSlide();
  }

  startAutoSlide() {
    setInterval(() => {
      this.nextNews();
    }, 5000);
  }

  nextNews() {
    this.currentIndex = (this.currentIndex + 1) % this.newsItems.length;
  }

  previousNews() {
    this.currentIndex = this.currentIndex === 0 ? this.newsItems.length - 1 : this.currentIndex - 1;
  }

  goToNews(index: number) {
    this.currentIndex = index;
  }

  getNewsTypeClass(type: string): string {
    return `news-type-${type}`;
  }

  onButtonClick(newsItem: any): void {
    // Aquí puedes manejar diferentes acciones según el tipo
    switch(newsItem.action) {
      case 'call':
        // Abrir marcador telefónico
        window.location.href = 'tel:+51999999999';
        break;
      case 'navigate':
        this.router.navigate(['/notificaciones']);
        break;
      case 'contact':
        // Abrir formulario de contacto o WhatsApp
        window.open('https://wa.me/51999999999', '_blank');
        break;
      default:
        console.log('Click en:', newsItem.title);
    }
  }
}
