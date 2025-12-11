import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UbicationMapComponent } from '../../components/ubication-map/ubication-map';
import { UbicationFormComponent } from '../../components/ubication-form/ubication-form';
import { LocationService, UserLocation } from '../../../../../core/services/location.service';

export interface Ubication extends UserLocation {}

@Component({
  selector: 'app-edit-ubication',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule, UbicationMapComponent, UbicationFormComponent],
  templateUrl: './edit-ubication.html',
  styleUrl: './edit-ubication.scss',
})
export class EditUbicationPage implements OnInit {
  @ViewChild(UbicationFormComponent) formComponent!: UbicationFormComponent;
  locationId: number | null = null;
  ubication: Ubication | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.locationId = id ? parseInt(id, 10) : null;
    
    if (!this.locationId) {
      this.router.navigate(['/app/perfil']);
      return;
    }
    
    this.loadLocationData();
  }

  private loadLocationData(): void {
    this.isLoading = true;
    
    if (!this.locationId) {
      this.isLoading = false;
      return;
    }

    this.locationService.getUserLocations().subscribe({
      next: (locations: UserLocation[]) => {
        this.ubication = locations.find((u: UserLocation) => u.id === this.locationId) as Ubication || null;
        
        if (!this.ubication) {
          console.warn('Location not found with id:', this.locationId);
          this.isLoading = false;
          return;
        }
        
        // Precargar datos en el formulario
        setTimeout(() => {
          if (this.formComponent && this.ubication) {
            this.formComponent.setSelectedLocation({
              latitude: this.ubication!.latitude,
              longitude: this.ubication!.longitude
            });
          }
        }, 100);
        
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar ubicación:', err);
        this.isLoading = false;
      }
    });
  }

  onLocationSelected(data: { latitude: number; longitude: number }): void {
    if (this.formComponent) {
      this.formComponent.setSelectedLocation(data);
    }
  }

  onCancel(): void {
    this.router.navigate(['/app/perfil']);
  }
}
