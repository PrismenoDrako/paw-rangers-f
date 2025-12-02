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
      title: '¡Nuevo sistema de alertas!',
      description: 'Ahora recibirás notificaciones cuando se reporte una mascota cerca de tu ubicación.',
      date: new Date('2024-11-28'),
      type: 'feature',
      icon: 'pi-bell'
    },
    {
      id: 2,
      title: 'Historias de éxito',
      description: 'Este mes se reunieron 15 mascotas con sus familias. ¡Gracias a la comunidad!',
      date: new Date('2024-11-25'),
      type: 'success',
      icon: 'pi-heart'
    },
    {
      id: 3,
      title: 'Consejos de búsqueda',
      description: 'Aprende las mejores técnicas para encontrar a tu mascota perdida.',
      date: new Date('2024-11-20'),
      type: 'tip',
      icon: 'pi-lightbulb'
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
}
