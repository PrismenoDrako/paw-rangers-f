import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FloatingActionButton } from '../../components/floating-action-button/floating-action-button';
import { NewsBanner } from '../../components/news-banner/news-banner';
import { LostPetsSection } from '../../components/lost-pets-section/lost-pets-section';
import { FoundPetsSection } from '../../components/found-pets-section/found-pets-section';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    FloatingActionButton,
    NewsBanner,
    LostPetsSection,
    FoundPetsSection
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  
  constructor(private router: Router) {}

  navigateToLostPets(): void {
    this.router.navigate(['/app/animales-perdidos']);
  }

  navigateToFoundPets(): void {
    this.router.navigate(['/app/animales-encontrados']);
  }

  navigateToReportLost(): void {
    this.router.navigate(['/app/animales-perdidos/report']);
  }

  navigateToReportFound(): void {
    this.router.navigate(['/app/animales-encontrados/report']);
  }
}
