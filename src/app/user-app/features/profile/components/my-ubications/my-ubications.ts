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

  locations: Ubication[] = [];
  isLoading = true;
  private destroy$ = new Subject<void>();
  
  constructor(
    private router: Router,
    private messageService: MessageService
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
    
    // Simular delay de API
    setTimeout(() => {
      // Cargar del localStorage
      const saved = localStorage.getItem('ubications');
      if (saved) {
        try {
          this.locations = JSON.parse(saved);
        } catch (error) {
          console.error('Error al cargar ubicaciones:', error);
          this.locations = [];
        }
      }
      this.isLoading = false;
    }, 500);
  }

  openAddLocationForm(): void {
    this.router.navigate(['/app/crear-ubicacion']);
  }

  onLocationDeleted(id: string): void {
    this.locations = this.locations.filter(loc => loc.id !== id);
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Ubicación eliminada correctamente',
      life: 3000
    });
  }
}