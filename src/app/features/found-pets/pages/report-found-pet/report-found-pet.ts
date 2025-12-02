import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { ReportFoundForms } from '../../components/report-found-forms/report-found-forms';
import { FormStepData } from '../../types/form-step-data.interface';



@Component({
  selector: 'app-report-found-pet',
  standalone: true,
  imports: [CommonModule, ReportFoundForms],
  templateUrl: './report-found-pet.html',
  styleUrls: ['./report-found-pet.scss']
})
export class ReportFoundPet {
  constructor(
    private location: Location,
    private router: Router
  ) {}

  onFormSubmit(formData: FormStepData): void {
    console.log('Datos del formulario recibidos:', formData);
    
    // Aquí podrías enviar los datos a un servicio/API
    // Simular envío exitoso
    setTimeout(() => {
      alert('¡Reporte de mascota encontrada enviado exitosamente! Gracias por ayudar a reunir familias.');
      
      // Navegar de vuelta a la lista de mascotas encontradas
      this.router.navigate(['/animales-encontrados']);
    }, 500);
  }

  onFormCancel(): void {
    if (confirm('¿Estás seguro de que quieres cancelar el reporte? Se perderán todos los datos ingresados.')) {
      this.goBack();
    }
  }

  goBack(): void {
    this.location.back();
  }
}