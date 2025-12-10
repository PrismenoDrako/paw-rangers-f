import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminComunicadosPanelComponent } from './admin-comunicados-panel';

@Component({
  selector: 'app-comunicados-admin-page',
  standalone: true,
  imports: [CommonModule, AdminComunicadosPanelComponent],
  templateUrl: './comunicados-admin.page.html',
  styleUrls: ['./comunicados-admin.page.scss'],
})
export class ComunicadosAdminPage {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/app/notificaciones']);
  }
}
