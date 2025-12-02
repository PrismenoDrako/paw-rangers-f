import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-floating-action-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-action-button.html',
  styleUrl: './floating-action-button.scss',
})
export class FloatingActionButton {
  isExpanded = false;

  constructor(private router: Router) {}

  toggleMenu(): void {
    this.isExpanded = !this.isExpanded;
  }

  closeMenu(): void {
    this.isExpanded = false;
  }

  navigateToReportLost(): void {
    this.closeMenu();
    this.router.navigate(['/animales-perdidos/report']);
  }

  navigateToReportFound(): void {
    this.closeMenu();
    this.router.navigate(['/animales-encontrados/report']);
  }
}
