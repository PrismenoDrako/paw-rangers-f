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

// Services
import { SimilarityService, SimilarPet } from '../../../../core/services/similarity.service';

// Components
import { SimilarPetsModalComponent } from '../../../../shared/components/similar-pets-modal/similar-pets-modal';

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
    ToastModule,
    SimilarPetsModalComponent
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
  selectedPetId: string | null = null;
  isReportingOther = false;
  showSavePetModal = false;
  currentStep = 1;

  // Modal de mascotas similares
  showSimilarPetsModal = false;
  similarPets: SimilarPet[] = [];
  isFoundReport = false;

  // Datos de mascotas del usuario
  userPets = [
    {
      id: 1,
      name: 'Max',
      species: 'Perro',
      breed: 'Labrador',
      age: '3 años',
      gender: 'Macho',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'Luna',
      species: 'Gato',
      breed: 'Siamés',
      age: '2 años',
      gender: 'Hembra',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      name: 'Rocky',
      species: 'Perro',
      breed: 'Bulldog',
      age: '4 años',
      gender: 'Macho',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop'
    }
  ];

  speciesOptions: SpeciesOption[] = [
    { label: 'Perro', value: 'Perro' },
    { label: 'Gato', value: 'Gato' },
    { label: 'Ave', value: 'Ave' },
    { label: 'Otro', value: 'Otro' }
  ];

  genderOptions = [
    { label: 'Macho', value: 'Macho' },
    { label: 'Hembra', value: 'Hembra' }
  ];

  // Formularios
  petInfoForm = new FormGroup({
    petName: new FormControl('', Validators.required),
    species: new FormControl('', Validators.required),
    breed: new FormControl(''),
    age: new FormControl(''),
    gender: new FormControl('', Validators.required),
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
    private messageService: MessageService,
    private similarityService: SimilarityService
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

  togglePet(petId: number): void {
    const petIdStr = String(petId);
    
    if (this.selectedPetId === petIdStr) {
      // Deseleccionar
      this.selectedPetId = null;
      this.selectedPet = null;
      this.isReportingOther = false;
      this.petInfoForm.reset();
      this.photoPreview = null;
      this.photoFile = null;
    } else {
      // Seleccionar
      const pet = this.userPets.find(p => p.id === petId);
      if (pet) {
        this.selectedPetId = petIdStr;
        this.selectedPet = pet;
        this.isReportingOther = false;
        
        this.petInfoForm.patchValue({
          petName: pet.name,
          species: pet.species,
          breed: pet.breed || '',
          age: pet.age || '',
          gender: pet.gender || '',
          description: ''
        });
      }
    }
  }

  // Seleccionar mascota existente
  selectUserPet(pet: any): void {
    this.togglePet(pet.id);
  }

  // Reportar otra mascota
  reportOtherPet(): void {
    this.selectedPet = null;
    this.selectedPetId = null;
    this.isReportingOther = true;
    
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
      // Coordenadas por defecto (México)
      const defaultLat = 19.4326;
      const defaultLng = -99.1332;
      const defaultZoom = 13;

      // Función para inicializar el mapa con coordenadas
      const initializeMapWithCoords = (lat: number, lng: number, zoom: number) => {
        this.map = L.map('map').setView([lat, lng], zoom);

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
      };

      // Intentar obtener la ubicación actual del usuario
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            console.log('Ubicación del usuario:', userLat, userLng);
            initializeMapWithCoords(userLat, userLng, defaultZoom);
          },
          (error) => {
            console.warn('Error obteniendo ubicación:', error);
            // Si falla, usar coordenadas por defecto
            initializeMapWithCoords(defaultLat, defaultLng, defaultZoom);
          }
        );
      } else {
        console.warn('Geolocalización no disponible');
        // Si no hay geolocalización, usar coordenadas por defecto
        initializeMapWithCoords(defaultLat, defaultLng, defaultZoom);
      }
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

    // Buscar mascotas encontradas similares
    const petData = {
      species: reportData.pet.species || '',
      breed: reportData.pet.breed || '',
      gender: reportData.pet.gender || '',
      age: typeof reportData.pet.age === 'number'
        ? reportData.pet.age
        : reportData.pet.age
          ? Number(reportData.pet.age) || undefined
          : undefined,
      description: reportData.pet.description || ''
    };
    this.similarPets = this.similarityService.findSimilarFoundPets(petData);
    this.isFoundReport = false; // Indica que estamos reportando una mascota PERDIDA

    // Mostrar modal si hay mascotas similares
    if (this.similarPets.length > 0) {
      this.showSimilarPetsModal = true;
    } else {
      // Si no hay mascotas similares, navegar después de 2 segundos
      setTimeout(() => {
        this.router.navigate(['/animales-perdidos']);
      }, 2000);
    }
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

  onSimilarModalClose(): void {
    this.showSimilarPetsModal = false;
    // Navegar después de cerrar el modal
    setTimeout(() => {
      this.router.navigate(['/animales-perdidos']);
    }, 500);
  }

  goBack(): void {
    this.location.back();
  }
}
