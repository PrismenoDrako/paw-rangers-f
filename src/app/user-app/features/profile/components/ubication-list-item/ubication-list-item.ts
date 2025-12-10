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
import { AuthService } from '../../../../../core/services/auth.service';

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
  @Output() locationDeleted = new EventEmitter<string>();
  isDeleting = false;
  private storageKey = 'ubications:guest';
  
  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private auth: AuthService
  ) {
    const email = this.auth.user()?.email || 'guest';
    this.storageKey = `ubications:${email}`;
  }
  
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
    this.router.navigate([`/editar-ubicacion/${this.location.id}`]);
  }

  onDeleteLocation(): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro que deseas eliminar la ubicación "${this.location.name}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.isDeleting = true;
        
        try {
          // Eliminar del localStorage
          const saved = localStorage.getItem(this.storageKey);
          if (saved) {
            let ubications = JSON.parse(saved);
            ubications = ubications.filter((u: any) => u.id !== this.location.id);
            localStorage.setItem(this.storageKey, JSON.stringify(ubications));
          }

          this.isDeleting = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Ubicación eliminada correctamente',
            life: 2000
          });
          this.locationDeleted.emit(this.location.id);
        } catch (error) {
          this.isDeleting = false;
          console.error('Error al eliminar:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al eliminar la ubicación',
            life: 3000
          });
        }
      },
      reject: () => {
        // Usuario canceló
      }
    });
  }
}
