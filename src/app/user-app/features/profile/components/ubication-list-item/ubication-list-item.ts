import { Component, Input, Output, EventEmitter } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LocationService } from '../../../../../core/services/location.service';

@Component({
  selector: 'app-ubication-list-item', 
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    BadgeModule,
    TooltipModule,
    ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './ubication-list-item.html',
  styleUrl: './ubication-list-item.scss',
  providers: [ConfirmationService, MessageService]
})
export class UbicationListItemComponent { 
  
  @Input() location: any;
  @Output() locationDeleted = new EventEmitter<number>();
  isDeleting = false;
  
  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private locationService: LocationService
  ) { }
  
  getIcon(): string {
    const name = this.location.name.toLowerCase();
    if (name.includes('casa') || name.includes('hogar')) {
      return 'pi pi-home';
    } else if (name.includes('trabajo') || name.includes('oficina')) {
      return 'pi pi-briefcase';
    }
    return 'pi pi-map-marker';
  }

  onEditLocation(): void {
    // TODO: Implementar edición de ubicación
    this.messageService.add({
      severity: 'info',
      summary: 'Función no disponible',
      detail: 'La edición de ubicaciones aún no está implementada',
      life: 3000
    });
  }

  onDeleteLocation(): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro que deseas eliminar la ubicación "${this.location.name}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.isDeleting = true;
        console.log('Eliminando ubicación:', this.location.id);
        
        this.locationService.deleteUserLocation(this.location.id).subscribe({
          next: (response) => {
            console.log('Ubicación eliminada:', response);
            this.isDeleting = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Ubicación eliminada correctamente',
              life: 2000
            });
            this.locationDeleted.emit(this.location.id);
          },
          error: (err) => {
            console.error('Error al eliminar ubicación:', err);
            this.isDeleting = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar la ubicación',
              life: 3000
            });
          }
        });
      },
      reject: () => {
        // Usuario canceló
      }
    });
  }
}
