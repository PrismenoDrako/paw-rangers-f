import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-footer',
  standalone: true,
  templateUrl: './notification-footer.html',
  styleUrls: ['./notification-footer.scss']
})
export class NotificationFooterComponent {
  constructor(private router: Router) {}

  goToSettings() {
    this.router.navigate(['/notification-settings']);
  }
}
