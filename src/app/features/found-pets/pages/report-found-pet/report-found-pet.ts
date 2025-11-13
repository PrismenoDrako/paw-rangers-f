import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface FoundPetFormData {
  animalType: string;
  breed: string;
  photo: string | null;
  hasCollar: boolean | null;
  location: string;
  description: string;
  contactPhone: string;
}

@Component({
  selector: 'app-report-found-pet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-found-pet.html',
  styleUrls: ['./report-found-pet.scss']
})
export class ReportFoundPet {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  formData: FoundPetFormData = {
    animalType: '',
    breed: '',
    photo: null,
    hasCollar: null,
    location: '',
    description: '',
    contactPhone: ''
  };

  constructor(
    private location: Location,
    private router: Router
  ) {}

  onFormChange(): void {
    // Método para manejar cambios en el formulario
    console.log('Formulario actualizado:', this.formData);
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onPhotoSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona una imagen válida');
        return;
      }
      
      // Validar tamaño (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('La imagen no puede ser mayor a 10MB');
        return;
      }
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.formData.photo = e.target?.result as string;
        this.onFormChange();
      };
      reader.readAsDataURL(file);
    }
  }

  openMapSelector(): void {
    // Implementar selector de mapa
    console.log('Abrir selector de mapa');
  }

  isFormValid(): boolean {
    return (
      this.formData.animalType.trim() !== '' &&
      this.formData.location.trim() !== '' &&
      this.formData.description.trim() !== '' &&
      this.formData.contactPhone.trim() !== '' &&
      this.formData.hasCollar !== null
    );
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      console.log('Enviando reporte:', this.formData);
      
      // Simular envío
      alert('¡Reporte enviado exitosamente! Gracias por ayudar a reunir familias.');
      
      // Navegar de vuelta a la lista
      this.router.navigate(['/animales-encontrados']);
    }
  }

  onCancel(): void {
    if (confirm('¿Estás seguro de que quieres cancelar? Se perderán todos los datos ingresados.')) {
      this.goBack();
    }
  }

  goBack(): void {
    this.location.back();
  }
}