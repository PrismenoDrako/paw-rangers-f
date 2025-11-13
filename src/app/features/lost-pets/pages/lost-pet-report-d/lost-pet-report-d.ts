import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';

// Importar componentes
import { PetSelector } from '../../components/pet-selector/pet-selector';
import { PetInfoForm, PetInfo } from '../../components/pet-info-form/pet-info-form';
import { LocationMap, LocationData } from '../../components/location-map/location-map';
import { DescriptionForm, DescriptionFormData } from '../../components/description-form/description-form';
import { FormActions } from '../../components/form-actions/form-actions';

interface ReportData {
  selectedPet?: any;
  petInfo?: PetInfo;
  location?: LocationData;
  description?: DescriptionFormData;
}

@Component({
  selector: 'app-lost-pet-report-d',
  standalone: true,
  imports: [
    CommonModule,
    PetSelector,
    PetInfoForm,
    LocationMap,
    DescriptionForm,
    FormActions
  ],
  templateUrl: './lost-pet-report-d.html',
  styleUrl: './lost-pet-report-d.scss',
})
export class LostPetReportD implements OnInit {
  
  // Datos de ejemplo de mascotas del usuario
  userPets = [
    {
      id: 1,
      name: 'Rocky',
      type: 'Perro',
      breed: 'Bulldog',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'Luna',
      type: 'Gato',
      breed: 'Siamés',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      name: 'Max',
      type: 'Perro',
      breed: 'Labrador',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop'
    }
  ];

  // Datos del formulario
  selectedPet: any = null;
  reportData: ReportData = {};

  constructor(
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Inicialización si es necesario
  }

  get isFormValid(): boolean {
    const hasValidPetInfo = this.reportData.petInfo?.name && this.reportData.petInfo?.type;
    const hasValidLocation = this.reportData.location?.address;
    const hasValidDescription = this.reportData.description?.description && 
                               this.reportData.description?.contactName && 
                               this.reportData.description?.contactPhone;
    
    return !!(hasValidPetInfo && hasValidLocation && hasValidDescription);
  }

  onPetSelected(pet: any): void {
    this.selectedPet = pet;
    this.reportData.selectedPet = pet;
    console.log('Mascota seleccionada:', pet);
  }

  onReportOther(): void {
    this.selectedPet = null;
    this.reportData.selectedPet = null;
    console.log('Reportando otra mascota');
  }

  onPetInfoChange(petInfo: PetInfo): void {
    this.reportData.petInfo = petInfo;
    console.log('Información de mascota actualizada:', petInfo);
  }

  onLocationChange(location: LocationData): void {
    this.reportData.location = location;
    console.log('Ubicación actualizada:', location);
  }

  onDescriptionChange(description: DescriptionFormData): void {
    this.reportData.description = description;
    console.log('Descripción actualizada:', description);
  }

  onSubmitReport(): void {
    if (this.isFormValid) {
      console.log('Enviando reporte:', this.reportData);
      // Aquí se implementaría la lógica para enviar el reporte al backend
      alert('¡Reporte enviado exitosamente! Te notificaremos si encontramos información sobre tu mascota.');
      this.router.navigate(['/animales-perdidos']);
    }
  }

  onCancelReport(): void {
    if (confirm('¿Estás seguro de que quieres cancelar? Se perderán todos los datos ingresados.')) {
      this.goBack();
    }
  }

  goBack(): void {
    this.location.back();
  }
}
