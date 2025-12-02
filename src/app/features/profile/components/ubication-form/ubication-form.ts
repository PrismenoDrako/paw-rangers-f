import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-ubication-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    SelectButtonModule
  ],
  templateUrl: './ubication-form.html',
  styleUrl: './ubication-form.scss'
})
export class UbicationFormComponent implements OnInit {
  locationForm!: FormGroup;

  locationTypeOptions = [
    { label: 'Casa', value: 'Casa', icon: 'pi pi-home' },
    { label: 'Trabajo', value: 'Trabajo', icon: 'pi pi-briefcase' },
    { label: 'Favorito', value: 'Favorito', icon: 'pi pi-heart' }
  ];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.locationForm = this.fb.group({
      locationType: ['Casa', Validators.required],
      customName: ['', Validators.required],
      fullAddress: ['', Validators.required]
    });
  }

  setSelectedLocation(data: { latitude: number; longitude: number; address: string }): void {
    this.locationForm.patchValue({
      fullAddress: data.address
    });
  }

  onCancel(): void {
    this.router.navigate(['/perfil']);
  }

  onSave(): void {
    if (this.locationForm.valid) {
      console.log('Guardando ubicación:', this.locationForm.value);
      this.router.navigate(['/perfil']);
    }
  }
}
