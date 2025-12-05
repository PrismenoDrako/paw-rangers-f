import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

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
  selector: 'app-ubication-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    SelectButtonModule,
    ToastModule
  ],
  templateUrl: './ubication-form.html',
  styleUrl: './ubication-form.scss',
  providers: [MessageService]
})
export class UbicationFormComponent implements OnInit {
  locationForm!: FormGroup;
  locationData: { latitude: number; longitude: number; address: string } | null = null;
  isSaving = false;
  isEditMode = false;
  editingId: string | null = null;

  locationTypeOptions = [
    { label: 'Casa', value: 'Casa', icon: 'pi pi-home' },
    { label: 'Trabajo', value: 'Trabajo', icon: 'pi pi-briefcase' },
    { label: 'Favorito', value: 'Favorito', icon: 'pi pi-heart' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.locationForm = this.fb.group({
      locationType: ['Casa', Validators.required],
      customName: [''],
      fullAddress: ['']
    });
  }

  setSelectedLocation(data: { latitude: number; longitude: number; address: string }): void {
    this.locationData = data;
    this.locationForm.patchValue({
      fullAddress: data.address
    });
  }

  setEditMode(ubication: Ubication): void {
    this.isEditMode = true;
    this.editingId = ubication.id;
    this.locationForm.patchValue({
      locationType: ubication.type,
      customName: ubication.name,
      fullAddress: ubication.address
    });
    this.locationData = {
      latitude: ubication.latitude,
      longitude: ubication.longitude,
      address: ubication.address
    };
  }

  onCancel(): void {
    this.router.navigate(['/perfil']);
  }

  onSave(): void {
    if (this.locationForm.valid && this.locationData) {
      this.isSaving = true;
      const { locationType, customName, fullAddress } = this.locationForm.value;
      
      // Usar customName si existe, si no usar locationType
      const finalName = customName?.trim() || locationType;
      const finalAddress = fullAddress?.trim() || this.locationData.address || '';
      
      try {
        const saved = localStorage.getItem('ubications');
        const ubications = saved ? JSON.parse(saved) : [];
        
        if (this.isEditMode && this.editingId) {
          // Actualizar ubicación existente
          const index = ubications.findIndex((u: any) => u.id === this.editingId);
          if (index !== -1 && this.locationData) {
            ubications[index] = {
              ...ubications[index],
              name: finalName,
              address: finalAddress,
              latitude: this.locationData.latitude,
              longitude: this.locationData.longitude,
              type: locationType
            };
          }
        } else {
          // Crear nueva ubicación
          if (this.locationData) {
            const ubication = {
              id: this.generateId(),
              name: finalName,
              address: finalAddress,
              latitude: this.locationData.latitude,
              longitude: this.locationData.longitude,
              type: locationType,
              createdAt: new Date()
            };
            ubications.push(ubication);
          }
        }
        
        localStorage.setItem('ubications', JSON.stringify(ubications));
        this.isSaving = false;
        
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: this.isEditMode ? 'Ubicación actualizada correctamente' : 'Ubicación guardada correctamente',
          life: 1500
        });
        
        // Navegar después del timeout
        setTimeout(() => this.router.navigate(['/perfil']), 1500);
      } catch (error) {
        this.isSaving = false;
        console.error('Error al guardar:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al guardar la ubicación',
          life: 3000
        });
      }
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
