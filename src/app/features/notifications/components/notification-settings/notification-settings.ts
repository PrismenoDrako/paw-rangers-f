import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationPreferences, NotificationPreferencesService } from '../../services/notification-preferences.service';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.html',
  styleUrls: ['./notification-settings.scss'],
  standalone: true,
  imports: [FormsModule]
})
export class NotificationSettingsComponent implements OnInit {
  notificationPreferences: NotificationPreferences = { mascotas: true, foro: true };
  saving = false;

  constructor(
    private preferencesService: NotificationPreferencesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.notificationPreferences = { ...this.preferencesService.currentPreferences };
  }

  saveSettings(): void {
    this.saving = true;
    this.preferencesService.updatePreferences({ ...this.notificationPreferences });
    setTimeout(() => {
      this.saving = false;
      this.router.navigate(['/notificaciones']);
    }, 200);
  }

  resetChanges(): void {
    this.notificationPreferences = { ...this.preferencesService.currentPreferences };
  }

  cancel(): void {
    this.resetChanges();
    this.router.navigate(['/notificaciones']);
  }
}
