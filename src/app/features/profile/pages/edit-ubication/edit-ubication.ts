import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UbicationMapComponent } from '../../components/ubication-map/ubication-map';
import { UbicationFormComponent } from '../../components/ubication-form/ubication-form';

export interface Ubication {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'Casa' | 'Trabajo' | 'Favorito' | string;
  createdAt?: Date;
}

@Component({
  selector: 'app-edit-ubication',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule, UbicationMapComponent, UbicationFormComponent],
  templateUrl: './edit-ubication.html',
  styleUrl: './edit-ubication.scss',
})
export class EditUbicationPage implements OnInit {
  @ViewChild(UbicationFormComponent) formComponent!: UbicationFormComponent;
  locationId: string | null = null;
  ubication: Ubication | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.paramMap.get('id');
    
    if (!this.locationId) {
      this.router.navigate(['/perfil']);
      return;
    }
    
    this.loadLocationData();
  }

  private loadLocationData(): void {
    this.isLoading = true;
    
    // Simular delay
    setTimeout(() => {
      const saved = localStorage.getItem('ubications');
      if (saved) {
        try {
          const ubications = JSON.parse(saved);
          this.ubication = ubications.find((u: Ubication) => u.id === this.locationId);
          
          if (!this.ubication) {
            this.router.navigate(['/perfil']);
            return;
          }
          
          // Precargar datos en el formulario
          setTimeout(() => {
            if (this.formComponent && this.ubication) {
              this.formComponent.setEditMode(this.ubication);
              this.formComponent.setSelectedLocation({
                latitude: this.ubication.latitude,
                longitude: this.ubication.longitude,
                address: this.ubication.address
              });
            }
          }, 100);
        } catch (error) {
          console.error('Error al cargar ubicación:', error);
          this.router.navigate(['/perfil']);
        }
      }
      this.isLoading = false;
    }, 500);
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
