import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LocationService } from '../../../../../core/services/location.service';

@Component({
  selector: 'app-ubication-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CardModule,
    ToastModule
  ],
  templateUrl: './ubication-form.html',
  styleUrl: './ubication-form.scss',
  providers: [MessageService]
})
export class UbicationFormComponent implements OnInit {
  locationForm!: FormGroup;
  isSaving = false;
  locationData: { latitude: number; longitude: number } | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private locationService: LocationService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.locationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  /**
   * Recibe la ubicación seleccionada del mapa
   */
  setSelectedLocation(data: { latitude: number; longitude: number }): void {
    this.locationData = data;
    console.log('UbicationFormComponent - Ubicación seleccionada del mapa:', data);
  }

  onCancel(): void {
    this.router.navigate(['/app/perfil']);
  }

  onSave(): void {
    if (this.locationForm.valid && this.locationData) {
      this.isSaving = true;
      const formData = this.locationForm.value;
      
      console.log('UbicationFormComponent - Guardando ubicación:', formData);

      this.locationService.createUserLocation({
        name: formData.name,
        latitude: this.locationData.latitude,
        longitude: this.locationData.longitude,
        radius: 5000 // Radio por defecto
      }).subscribe({
        next: (response: any) => {
          console.log('Ubicación creada exitosamente:', response);
          this.isSaving = false;
          
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Ubicación guardada correctamente',
            life: 1500
          });
          
          setTimeout(() => this.router.navigate(['/app/perfil']), 1500);
        },
        error: (err) => {
          console.error('Error al guardar ubicación:', err);
          this.isSaving = false;
          
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al guardar la ubicación',
            life: 3000
          });
        }
      });
    } else {
      this.locationForm.markAllAsTouched();
    }
  }
}
