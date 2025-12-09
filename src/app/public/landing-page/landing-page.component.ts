import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './components/hero/hero.component';
import { FeaturesComponent } from './components/features/features.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { CtaSectionComponent } from './components/cta-section/cta-section.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    FeaturesComponent,
    HowItWorksComponent,
    CtaSectionComponent,
    FooterComponent
  ],
  template: `
    <main class="landing-page">
      <app-hero></app-hero>
      <app-features></app-features>
      <app-how-it-works></app-how-it-works>
      <app-cta-section></app-cta-section>
      <app-footer></app-footer>
    </main>
  `,
  styles: [`
    .landing-page {
      overflow: hidden;
    }
  `]
})
export class LandingPageComponent {}
