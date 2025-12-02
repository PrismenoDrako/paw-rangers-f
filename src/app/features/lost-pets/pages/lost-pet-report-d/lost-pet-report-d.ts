import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

// PrimeNG Imports
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Leaflet
import * as L from 'leaflet';

// Configurar iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface SpeciesOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-lost-pet-report-d',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StepperModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    DatePickerModule,
    DialogModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './lost-pet-report-d.html',
  styleUrl: './lost-pet-report-d.scss',
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LostPetReportD implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('photoInput') photoInput!: ElementRef<HTMLInputElement>;
  
  private map: L.Map | null = null;
  private marker: L.Marker | null = null;
  private mapInitialized = false;
  
  today = new Date();
  photoPreview: string | null = null;
  photoFile: File | null = null;
  selectedPet: any = null;
  isReportingOther = false;
  showSavePetModal = false;
  petSelected = false;
  currentStep = 1;

  // Datos de mascotas del usuario
  userPets = [
    {
      id: 1,
      name: 'Max',
      species: 'Perro',
      breed: 'Labrador',
      age: '3 años',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'Luna',
      species: 'Gato',
      breed: 'Siamés',
      age: '2 años',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      name: 'Rocky',
      species: 'Perro',
      breed: 'Bulldog',
      age: '4 años',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop'
    }
  ];

  speciesOptions: SpeciesOption[] = [
    { label: 'Perro', value: 'Perro' },
    { label: 'Gato', value: 'Gato' },
    { label: 'Ave', value: 'Ave' },
    { label: 'Otro', value: 'Otro' }
  ];

  // Formularios
  petInfoForm = new FormGroup({
    petName: new FormControl('', Validators.required),
    species: new FormControl('', Validators.required),
    breed: new FormControl(''),
    age: new FormControl(''),
    description: new FormControl('', Validators.required)
  });

  locationForm = new FormGroup({
    address: new FormControl('', Validators.required),
    latitude: new FormControl<number | null>(null),
    longitude: new FormControl<number | null>(null),
    lostDate: new FormControl<Date | null>(null, Validators.required),
    lostTime: new FormControl('')
  });

  rewardForm = new FormGroup({
    hasCollar: new FormControl<boolean | null>(null),
    offerReward: new FormControl(false),
    rewardAmount: new FormControl<number | null>(null)
  });

  constructor(
    private location: Location,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Observar cambios en offerReward para validaciones condicionales
    this.rewardForm.get('offerReward')?.valueChanges.subscribe(checked => {
      const rewardAmountControl = this.rewardForm.get('rewardAmount');
      if (checked) {
        rewardAmountControl?.setValidators([Validators.required, Validators.min(0.01)]);
      } else {
        rewardAmountControl?.clearValidators();
        rewardAmountControl?.setValue(null);
      }
      rewardAmountControl?.updateValueAndValidity();
    });
  }

  ngAfterViewInit(): void {
    // El mapa se inicializará cuando el usuario llegue al paso 2
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  // Seleccionar mascota existente
  selectUserPet(pet: any): void {
    this.selectedPet = pet;
    this.isReportingOther = false;
    this.petSelected = true;
    
    // Rellenar campos automáticamente
    this.petInfoForm.patchValue({
      petName: pet.name,
      species: pet.species,
      breed: pet.breed || '',
      age: pet.age || '',
      description: '' // Descripción siempre vacía
    });
  }

  // Reportar otra mascota
  reportOtherPet(): void {
    this.selectedPet = null;
    this.isReportingOther = true;
    this.petSelected = true;
    
    // Limpiar todos los campos
    this.petInfoForm.reset();
    this.photoPreview = null;
    this.photoFile = null;
  }

  // Método llamado al cambiar de paso
  onStepChange(step: number): void {
    this.currentStep = step;
    console.log('Cambio a paso:', step);
    
    // Inicializar mapa cuando se llega al paso 2
    if (step === 2) {
      setTimeout(() => {
        this.initMap();
      }, 300);
    }
  }

  // Manejo de foto
  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.photoFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    this.photoPreview = null;
    this.photoFile = null;
    if (this.photoInput) {
      this.photoInput.nativeElement.value = '';
    }
  }

  // Inicializar mapa
  initMap(): void {
    if (this.mapInitialized || this.map) {
      console.log('Mapa ya inicializado');
      return;
    }

    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Elemento del mapa no encontrado');
      return;
    }

    console.log('Inicializando mapa...');
    try {
      this.map = L.map('map').setView([19.4326, -99.1332], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(this.map);

      this.map.on('click', (e: L.LeafletMouseEvent) => {
        this.onMapClick(e);
      });

      // Forzar que el mapa se redibuje correctamente
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 100);

      this.mapInitialized = true;
      console.log('Mapa inicializado correctamente');
    } catch (error) {
      console.error('Error inicializando mapa:', error);
    }
  }

  onMapClick(e: L.LeafletMouseEvent): void {
    if (!this.map) {
      console.error('Mapa no disponible');
      return;
    }

    const { lat, lng } = e.latlng;
    console.log('Clic en mapa:', lat, lng);

    // Agregar o mover marcador
    if (this.marker) {
      this.marker.setLatLng(e.latlng);
    } else {
      this.marker = L.marker(e.latlng).addTo(this.map);
    }

    // Auto-completar coordenadas
    this.locationForm.patchValue({
      latitude: lat,
      longitude: lng
    });

    // Obtener dirección usando reverse geocoding
    this.getAddressFromCoordinates(lat, lng);

    // Auto-completar fecha y hora actual
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    console.log('Completando fecha:', now);
    console.log('Completando hora:', timeString);
    
    this.locationForm.patchValue({
      lostDate: now,
      lostTime: timeString
    });
    
    console.log('Formulario actualizado:', this.locationForm.value);
  }

  // Validación
  isFormValid(): boolean {
    const rewardValid = this.rewardForm.get('offerReward')?.value 
      ? this.rewardForm.valid 
      : true;
    
    return this.petInfoForm.valid && 
           this.locationForm.valid && 
           rewardValid;
  }

  // Enviar reporte
  submitReport(): void {
    if (!this.isFormValid()) return;

    // Si es una mascota nueva (otra mascota), mostrar modal
    if (this.isReportingOther) {
      this.showSavePetModal = true;
    } else {
      this.finalizeReport(false);
    }
  }

  // Guardar y continuar
  saveAndContinue(savePet: boolean): void {
    this.showSavePetModal = false;
    this.finalizeReport(savePet);
  }

  // Finalizar reporte
  finalizeReport(savePetToProfile: boolean): void {
    const reportData = {
      pet: this.petInfoForm.value,
      location: this.locationForm.value,
      reward: this.rewardForm.value,
      photo: this.photoFile,
      isUserPet: !!this.selectedPet,
      selectedPetId: this.selectedPet?.id || null,
      savePetToProfile: savePetToProfile
    };

    console.log('Reporte enviado:', reportData);
    
    if (savePetToProfile) {
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: '¡Reporte publicado y mascota guardada en tu perfil!'
      });
    } else {
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: '¡Reporte publicado exitosamente!'
      });
    }

    setTimeout(() => {
      this.router.navigate(['/animales-perdidos']);
    }, 2000);
  }

  // Obtener dirección desde coordenadas usando Nominatim (OpenStreetMap)
  getAddressFromCoordinates(lat: number, lng: number): void {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data && data.display_name) {
          this.locationForm.patchValue({
            address: data.display_name
          });
        }
      })
      .catch(error => {
        console.error('Error obteniendo dirección:', error);
        // Si falla, dejar que el usuario la ingrese manualmente
      });
  }

  goBack(): void {
    this.location.back();
  }
}
