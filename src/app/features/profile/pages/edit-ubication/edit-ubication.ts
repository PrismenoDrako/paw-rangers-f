import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UbicationMapComponent } from '../../components/ubication-map/ubication-map';
import { UbicationFormComponent } from '../../components/ubication-form/ubication-form';

@Component({
  selector: 'app-edit-ubication',
  standalone: true,
  imports: [CommonModule, UbicationMapComponent, UbicationFormComponent],
  templateUrl: './edit-ubication.html',
  styleUrl: './edit-ubication.scss',
})
export class EditUbicationPage implements OnInit {
  @ViewChild(UbicationFormComponent) formComponent!: UbicationFormComponent;
  locationId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el ID de la ubicación desde la ruta
    this.locationId = this.route.snapshot.paramMap.get('id');
    
    if (!this.locationId) {
      this.router.navigate(['/perfil']);
    }
    
    // Aquí se cargarían los datos de la ubicación desde la API
    // this.loadLocationData(this.locationId);
  }

  onLocationSelected(data: { latitude: number; longitude: number; address: string }): void {
    if (this.formComponent) {
      this.formComponent.setSelectedLocation(data);
    }
  }

  onCancel(): void {
    this.router.navigate(['/perfil']);
  }
}
