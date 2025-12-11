import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService, ConfirmationService } from 'primeng/api';
// Components
import { UbicationListItemComponent } from '../ubication-list-item/ubication-list-item';
import { Subject } from 'rxjs';
import { LocationService, UserLocation } from '../../../../../core/services/location.service';

@Component({
  selector: 'app-my-ubications', 
  standalone: true,
  imports: [
    CommonModule, 
    CardModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    UbicationListItemComponent
  ],
  templateUrl: './my-ubications.html',
  styleUrl: './my-ubications.scss',
  providers: [MessageService, ConfirmationService]
})
export class MyUbicationsComponent implements OnInit, OnDestroy { 

  locations: UserLocation[] = [];
  isLoading = true;
  private destroy$ = new Subject<void>();
  
  constructor(
    private router: Router,
    private messageService: MessageService,
    private locationService: LocationService
  ) { }

  ngOnInit(): void {
    this.loadUbications();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUbications(): void {
    this.isLoading = true;
    console.log('MyUbicationsComponent - Cargando ubicaciones del servidor...');
    
    this.locationService.getUserLocations().subscribe({
      next: (response: any) => {
        console.log('Respuesta de ubicaciones:', response);
        // El endpoint devuelve las ubicaciones directamente o en response.data
        const locationsList = response?.data || response || [];
        this.locations = Array.isArray(locationsList) ? locationsList : [];
        console.log('Ubicaciones cargadas:', this.locations);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando ubicaciones:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las ubicaciones',
          life: 3000
        });
        this.isLoading = false;
      }
    });
  }

  openAddLocationForm(): void {
    this.router.navigate(['/app/crear-ubicacion']);
  }

  onLocationDeleted(id: number): void {
    this.locations = this.locations.filter(loc => loc.id !== id);
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Ubicación eliminada correctamente',
      life: 3000
    });
  }
}
