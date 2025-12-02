import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UbicationMapComponent } from '../../components/ubication-map/ubication-map';
import { UbicationFormComponent } from '../../components/ubication-form/ubication-form';

@Component({
  selector: 'app-create-ubication',
  standalone: true,
  imports: [CommonModule, UbicationMapComponent, UbicationFormComponent],
  templateUrl: './create-ubication.html',
  styleUrl: './create-ubication.scss',
})
export class CreateUbicationPage {
  @ViewChild(UbicationFormComponent) formComponent!: UbicationFormComponent;

  constructor(private router: Router) {}

  onLocationSelected(data: { latitude: number; longitude: number; address: string }): void {
    if (this.formComponent) {
      this.formComponent.setSelectedLocation(data);
    }
  }

  onCancel(): void {
    this.router.navigate(['/perfil']);
  }
}
