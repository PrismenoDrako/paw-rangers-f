import { Component, OnInit, AfterViewInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG Imports
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Services
import { SimilarityService, SimilarPet } from '../../../../../core/services/similarity.service';

// Components
import { SimilarPetsModalComponent } from '../../../../../shared/components/similar-pets-modal/similar-pets-modal';

// Leaflet
import * as L from 'leaflet';

// Configurar iconos de Leaflet usando CDN (soluciona problema de iconos faltantes)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Types
import { FormStepData } from '../../types/form-step-data.interface';

interface SpeciesOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-report-found-forms',
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
    ToastModule,
    SimilarPetsModalComponent
  ],
  providers: [MessageService],
  templateUrl: './report-found-forms.html',
  styleUrls: ['./report-found-forms.scss'],
})

export class ReportFoundForms implements OnInit, AfterViewInit, OnDestroy {
  @Output() formSubmit = new EventEmitter<FormStepData>();
  @Output() formCancel = new EventEmitter<void>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  private map!: L.Map;
  private marker?: L.Marker;
  private mapInitialized = false;
  private initializationAttempts = 0;
  selectedLocation: { lat: number; lng: number } | null = null;
  locationAddress: string = '';
  currentStep: number = 1;

  // Modal de mascotas similares
  showSimilarPetsModal = false;
  similarPets: SimilarPet[] = [];
  isFoundReport = true;

  speciesOptions: SpeciesOption[] = [
    { label: 'Perro', value: 'perro' },
    { label: 'Gato', value: 'gato' },
    { label: 'Ave', value: 'ave' },
    { label: 'Conejo', value: 'conejo' },
    { label: 'Otro', value: 'otro' }
  ];

  uploadedPhoto: File | null = null;
  photoPreview: string | null = null;
  maxDate: Date = new Date();

  reportFoundForm = new FormGroup({
    petDetails: new FormGroup({
      photo: new FormControl<File | null>(null, Validators.required),
      species: new FormControl('', Validators.required),

      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      hasCollar: new FormControl<string>('no', Validators.required)
    }),
    location: new FormGroup({
      latitude: new FormControl<number | null>(null, Validators.required),
      longitude: new FormControl<number | null>(null, Validators.required),
      address: new FormControl('', Validators.required),
      foundDate: new FormControl<Date | null>(null, Validators.required),
      foundTime: new FormControl('', Validators.required)
    }),
    contactInfo: new FormGroup({
      finderName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]),
      email: new FormControl('', [Validators.required, Validators.email])
    })
  });

  constructor(
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private similarityService: SimilarityService
  ) { }

  ngOnInit() {
    // Inicializar con fecha y hora actual
    const now = new Date();
    this.reportFoundForm.patchValue({
      location: {
        foundDate: now,
        foundTime: now.toTimeString().slice(0, 5)
      }
    });
  }

  ngAfterViewInit() {
    // El mapa se inicializará cuando se active el paso 2
  }

  ngOnDestroy() {
    // Limpiar el mapa al destruir el componente
    if (this.map) {
      this.map.remove();
    }
  }

  // Método para asegurar que el mapa esté inicializado
  ensureMapInitialized() {
    if (!this.mapInitialized && this.initializationAttempts < 1) {
      this.initializationAttempts++;
      setTimeout(() => {
        this.forceInitMap();
      }, 100);
    }
  }

  // Método para inicializar el mapa cuando se muestra el paso 2
  onStepChange(stepIndex: number) {
    console.log('🔄 Cambio de paso:', stepIndex);
    if (stepIndex === 2) {
      // Resetear el contador de intentos
      this.initializationAttempts = 0;
      setTimeout(() => {
        this.forceInitMap();
      }, 200);
    }
  }

  private forceInitMap() {
    if (this.mapInitialized && this.map) {
      console.log('♻️ Mapa ya inicializado, redimensionando...');
      setTimeout(() => {
        this.map.invalidateSize();
      }, 100);
      return;
    }

    const mapElement = this.mapContainer?.nativeElement || document.getElementById('mapContainer');

    if (!mapElement) {
      console.error('❌ No se encontró el contenedor del mapa');
      return;
    }

    if (mapElement.offsetHeight === 0) {
      console.warn('⚠️ El contenedor del mapa no tiene altura, reintentando...');
      if (this.initializationAttempts < 5) {
        this.initializationAttempts++;
        setTimeout(() => this.forceInitMap(), 300);
      }
      return;
    }

    console.log('✅ Inicializando mapa con altura:', mapElement.offsetHeight);
    this.initMap();
  }

  private tryInitMap(attempt: number = 1) {
    // Método deprecado, usar forceInitMap en su lugar
    this.forceInitMap();
  }

  // ==================== PASO 1: DETALLES DE LA MASCOTA ====================

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onPhotoSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validar tamaño (máximo 5MB)
      if (file.size > 5000000) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'La imagen no debe superar los 5MB'
        });
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Solo se permiten archivos de imagen'
        });
        return;
      }

      this.uploadedPhoto = file;
      this.reportFoundForm.patchValue({
        petDetails: { photo: file }
      });

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto() {
    this.uploadedPhoto = null;
    this.photoPreview = null;
    this.reportFoundForm.patchValue({
      petDetails: { photo: null }
    });
  }

  validateStep1(callback: any): void {
    const petDetails = this.reportFoundForm.controls.petDetails;

    // Marcar todos los campos como touched
    Object.keys(petDetails.controls).forEach(key => {
      const control = petDetails.controls[key as keyof typeof petDetails.controls];
      control.markAsTouched();
    });

    if (petDetails.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Datos incompletos',
        detail: 'Por favor completa todos los campos requeridos'
      });
      return;
    }

    // Inicializar mapa al pasar al paso 2
    callback(2);
    this.onStepChange(2);
  }

  // ==================== PASO 2: UBICACIÓN ====================

  initMap() {
    if (this.mapInitialized) {
      console.log('⚠️ Mapa ya inicializado');
      return;
    }

    try {
      console.log('🗺️ INICIANDO MAPA LEAFLET...');

      // Limpiar mapa anterior si existe
      if (this.map) {
        console.log('🧹 Limpiando instancia anterior del mapa...');
        this.map.remove();
        this.map = undefined as any;
      }

      // Obtener el contenedor
      const container = document.getElementById('mapContainer');
      if (!container) {
        console.error('❌ Contenedor #mapContainer no encontrado');
        return;
      }

      // Limpiar el contenedor
      container.innerHTML = '';
      console.log('📦 Contenedor limpio y listo');

      // Coordenadas por defecto (Piura, Perú)
      const defaultLat = -5.1945;
      const defaultLng = -80.6328;
      const defaultZoom = 13;

      // Función para inicializar el mapa
      const initializeMapWithCoords = (lat: number, lng: number, zoom: number) => {
        console.log('📍 Creando instancia de mapa en [' + lat + ', ' + lng + ']');
        this.map = L.map(container, {
          center: [lat, lng],
          zoom: zoom,
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          touchZoom: true,
          dragging: true
        });

        console.log('🌍 Agregando capa de OpenStreetMap...');
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap',
          maxZoom: 19,
          minZoom: 3
        }).addTo(this.map);

        // Click event
        this.map.on('click', (e: L.LeafletMouseEvent) => {
          console.log('🖱️ Click en mapa:', e.latlng);
          this.onMapClick(e);
        });

        // Load event
        this.map.on('load', () => {
          console.log('✅ Mapa cargado completamente');
        });

        // Forzar redimensionamiento
        setTimeout(() => {
          if (this.map) {
            this.map.invalidateSize();
            console.log('📏 Mapa redimensionado');
          }
        }, 100);

        this.mapInitialized = true;
        console.log('✅✅✅ MAPA INICIALIZADO EXITOSAMENTE ✅✅✅');
      };

      // Intentar obtener la ubicación actual del usuario
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            console.log('📍 Ubicación del usuario detectada:', userLat, userLng);
            initializeMapWithCoords(userLat, userLng, defaultZoom);
          },
          (error) => {
            console.warn('⚠️ Error obteniendo ubicación:', error);
            // Si falla, usar coordenadas por defecto
            initializeMapWithCoords(defaultLat, defaultLng, defaultZoom);
          }
        );
      } else {
        console.warn('⚠️ Geolocalización no disponible en este navegador');
        // Si no hay geolocalización, usar coordenadas por defecto
        initializeMapWithCoords(defaultLat, defaultLng, defaultZoom);
      }

    } catch (error: any) {
      console.error('❌❌❌ ERROR CRÍTICO AL INICIALIZAR MAPA:', error);
      console.error('Stack:', error.stack);
      this.mapInitialized = false;

      this.messageService.add({
        severity: 'error',
        summary: 'Error en el mapa',
        detail: 'No se pudo cargar el mapa. Por favor recarga la página.'
      });
    }
  }

  onMapClick(e: L.LeafletMouseEvent) {
    const { lat, lng } = e.latlng;

    // Remover marcador anterior
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Agregar nuevo marcador
    this.marker = L.marker([lat, lng]).addTo(this.map);

    this.selectedLocation = { lat, lng };

    // Actualizar formulario
    this.reportFoundForm.patchValue({
      location: {
        latitude: lat,
        longitude: lng
      }
    });

    // Obtener dirección
    this.getAddressFromCoordinates(lat, lng);
  }

  async getAddressFromCoordinates(lat: number, lng: number) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=es`
      );
      const data = await response.json();
      this.locationAddress = data.display_name || 'Dirección no encontrada';

      this.reportFoundForm.patchValue({
        location: {
          address: this.locationAddress
        }
      });
    } catch (error) {
      console.error('Error al obtener dirección:', error);
      this.locationAddress = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
      this.reportFoundForm.patchValue({
        location: {
          address: this.locationAddress
        }
      });
    }
  }

  validateStep2(callback: any): void {
    const location = this.reportFoundForm.controls.location;

    // Marcar todos los campos como touched
    Object.keys(location.controls).forEach(key => {
      const control = location.controls[key as keyof typeof location.controls];
      control.markAsTouched();
    });

    if (location.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Ubicación requerida',
        detail: 'Por favor selecciona la ubicación en el mapa'
      });
      return;
    }

    callback(3);
  }

  // ==================== PASO 3: CONTACTO ====================

// ...existing code...
  submitReport(): void {
    const contactInfo = this.reportFoundForm.controls.contactInfo;

    // Marcar todos los campos como touched
    Object.keys(contactInfo.controls).forEach(key => {
      const control = contactInfo.controls[key as keyof typeof contactInfo.controls];
      control.markAsTouched();
    });

    if (this.reportFoundForm.valid) {
      const rawData = this.reportFoundForm.value;

      // Mapeo explícito para evitar incompatibilidades de tipos con FormStepData
      const mapped: any = {
        photo: this.uploadedPhoto ?? this.photoPreview ?? null,
        species: rawData?.petDetails?.species ?? '',
        breed: '', // Campo no definido en formulario
        gender: '', // Campo no definido en formulario
        age: '', // Campo no definido en formulario
        description: rawData?.petDetails?.description ?? '',
        hasCollar: (rawData?.petDetails?.hasCollar === 'si') ? true : false,
        location: {
          address: rawData?.location?.address ?? this.locationAddress ?? '',
          reference: '', // Campo no existe en el formulario pero lo requiere la interfaz
          coordinates: {
            lat: rawData?.location?.latitude ?? this.selectedLocation?.lat ?? 0,
            lng: rawData?.location?.longitude ?? this.selectedLocation?.lng ?? 0
          },
          date: rawData?.location?.foundDate ?? null,
          time: rawData?.location?.foundTime ?? ''
        },
        contact: {
          name: rawData?.contactInfo?.finderName ?? '',
          phone: rawData?.contactInfo?.phone ?? '',
          email: rawData?.contactInfo?.email ?? ''
        }
      };

      // Log para depuración
      console.log('📦 Datos del formulario a enviar:', mapped);
      console.log('📷 Archivo de foto:', this.uploadedPhoto);

      // Castear al tipo esperado para evitar error de asignación en tiempo de compilación
      const formData = mapped as unknown as FormStepData;

      // Emitir evento al componente padre
      this.formSubmit.emit(formData);

      this.messageService.add({
        severity: 'success',
        summary: 'Reporte enviado',
        detail: 'Tu reporte de mascota encontrada ha sido registrado exitosamente'
      });

      // Buscar mascotas perdidas similares
      const petData = {
        species: mapped.species || '',
        breed: mapped.breed || '',
        gender: mapped.gender || '',
        age: typeof mapped.age === 'number' ? mapped.age : undefined,
        description: mapped.description || ''
      };
      this.similarPets = this.similarityService.findSimilarLostPets(petData);

      // Mostrar modal si hay mascotas similares
      if (this.similarPets.length > 0) {
        this.showSimilarPetsModal = true;
      } else {
        // Si no hay mascotas similares, navegar después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/app/animales-encontrados']);
        }, 2000);
      }

    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Datos de contacto incompletos',
        detail: 'Por favor completa correctamente todos tus datos'
      });
    }
  }

  onSimilarModalClose(): void {
    this.showSimilarPetsModal = false;
    // Navegar después de cerrar el modal
    setTimeout(() => {
      this.router.navigate(['/app/animales-encontrados']);
    }, 500);
  }
// ...existing code...

  // ==================== HELPERS ====================

  isFieldInvalid(groupName: string, fieldName: string): boolean {
    const field = this.reportFoundForm.get(`${groupName}.${fieldName}`);
    return !!(field?.invalid && field?.touched);
  }

  getErrorMessage(groupName: string, fieldName: string): string {
    const field = this.reportFoundForm.get(`${groupName}.${fieldName}`);
    if (field?.hasError('required')) return 'Este campo es requerido';
    if (field?.hasError('email')) return 'Email inválido';
    if (field?.hasError('pattern')) return 'Debe tener 9 dígitos';
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    return '';
  }

  cancelReport(): void {
    // Navegar de vuelta a la lista de mascotas encontradas
    this.router.navigate(['/app/animales-encontrados']);
  }
}