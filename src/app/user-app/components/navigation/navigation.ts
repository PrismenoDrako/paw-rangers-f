import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationBellComponent } from '../notification-bell/notification-bell';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationBellComponent],
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.scss'],
})
export class Navigation {
  constructor(private auth: AuthService, private router: Router) {}

  logout(): void {
    this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth']);
      },
      error: () => {
        // Si hay error en logout, también redirigir al login
        this.router.navigate(['/auth']);
      }
    });
  }
}
