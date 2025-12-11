import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ApiService } from '../../../../../core/services/api.service';


// --- Interfaces para mejor tipado ---
export interface Pet {
  id?: number;
  name: string;
  speciesId?: number; // ID de la especie (para BD)
  species: string;   // Nombre de la especie
  breedId?: number;  // ID de la raza (para BD)
  breed: string;
  gender: string;
  age: number;
  imageUrl?: string; // URL después de guardar
  imageFile?: File; // Archivo binario para subir
}

export interface Species {
  id: number;
  name: string;
  scientificName?: string;
  code?: string;
}

export interface Breed {
  id: number;
  name: string;
  code?: string;
  speciesId: number; // ID de la especie a la que pertenece
}

interface DropdownOption {
  name: string;
  code: string;
}

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    ButtonModule, 
    InputTextModule, 
    InputNumberModule, 
    CardModule,
    SelectButtonModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  templateUrl: './pet-form.html',
  styleUrl: './pet-form.scss',
  providers: [ConfirmationService, MessageService]
})
export class PetFormComponent implements OnInit, OnChanges {
  
  @Input() petData: Pet | null = null;
  @Output() formSubmit = new EventEmitter<Pet>();
  @Output() formCancel = new EventEmitter<void>();
  @Output() formDelete = new EventEmitter<number>();

  private readonly apiService = inject(ApiService);

  petForm: FormGroup;
  isEditMode: boolean = false;
  localImageUrl: string | null = null;

  genderOptions = [
    { label: 'Macho', value: 'Macho', icon: 'pi pi-mars' },
    { label: 'Hembra', value: 'Hembra', icon: 'pi pi-venus' }
  ];

  // Arrays que se cargarán desde la API
  speciesOptions: Species[] = [];
  allBreeds: Breed[] = [];

  // Razas filtradas según la especie seleccionada
  filteredBreeds: Breed[] = [];

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.petForm = this.createFormGroup();

    // Listener para filtrar razas cuando cambia la especie
    this.petForm.get('species')?.valueChanges.subscribe((species: Species | null) => {
      this.onSpeciesChange(species);
    });
  }

  private createFormGroup(): FormGroup {
    return this.fb.group({
        id: [null],
        name: ['', Validators.required],
        species: [null, Validators.required],
        speciesId: [null],
        customSpecies: [''],
        breed: [null, Validators.required],
        breedId: [null],
        customBreed: [''],
        gender: ['Macho', Validators.required],
        age: [1, [Validators.required, Validators.min(0)]],
        imageFile: [null],
        imageUrl: [null]
    });
  }

  ngOnInit(): void {
    this.loadSpeciesAndBreeds();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['petData'] && !changes['petData'].firstChange) {
      // Si petData cambió (no es el primer cambio), reinicializar el formulario
      this.initializeForm();
    }
  }

  private loadSpeciesAndBreeds(): void {
    // Cargar especies desde la API
    this.apiService.get<any>('species').subscribe({
      next: (response) => {
        this.speciesOptions = response.data || [];
        console.log('Especies cargadas:', this.speciesOptions);
      },
      error: (err) => {
        console.error('Error cargando especies:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las especies',
          life: 3000
        });
      }
    });

    // Cargar razas desde la API
    this.apiService.get<any>('breeds').subscribe({
      next: (response) => {
        this.allBreeds = response.data || [];
        console.log('Razas cargadas:', this.allBreeds);
        // Inicializar form DESPUÉS de cargar AMBAS listas
        this.initializeForm();
      },
      error: (err) => {
        console.error('Error cargando razas:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las razas',
          life: 3000
        });
      }
    });
  }

  private initializeForm(): void {
    // Resetear el formulario completamente
    this.petForm.reset();
    this.localImageUrl = null;
    this.filteredBreeds = [];
    
    this.isEditMode = !!this.petData && !!this.petData.id;

    if (this.isEditMode && this.petData) {
        console.log('Initializing form for pet:', this.petData.name);
        
        // Cargar imagen si existe
        this.localImageUrl = this.petData.imageUrl || null;

        const selectedSpecies = this.speciesOptions.find(s => 
          s.name.toLowerCase() === this.petData!.species.toLowerCase()
        );
        
        if (selectedSpecies) {
          // Filtrar razas según especie primero
          this.onSpeciesChange(selectedSpecies);
        }

        // Patchear valores
        const formValue: any = {
            id: this.petData.id,
            name: this.petData.name,
            species: selectedSpecies || null,
            speciesId: this.petData.speciesId || selectedSpecies?.id,
            gender: this.petData.gender,
            age: this.petData.age,
            imageUrl: this.petData.imageUrl,
        };

        // Buscar la raza si existe
        if (selectedSpecies) {
          const selectedBreed = this.filteredBreeds.find(b => 
            b.name.toLowerCase() === this.petData!.breed.toLowerCase()
          );
          
          if (selectedBreed) {
            formValue.breed = selectedBreed;
            formValue.breedId = selectedBreed.id;
          }
        }

        this.petForm.patchValue(formValue);
        this.petForm.markAsPristine();
        this.petForm.markAsUntouched();
    } else {
      // Modo creación
      this.petForm.patchValue({
        gender: 'Macho',
        age: 1
      });
      this.petForm.markAsPristine();
      this.petForm.markAsUntouched();
    }
  }

  // Filtrar razas según especie seleccionada
  onSpeciesChange(species: Species | null): void {
    console.log('🔥 onSpeciesChange llamado con:', species);
    console.log('🔥 allBreeds disponibles:', this.allBreeds);
    
    if (!species) {
      this.filteredBreeds = [];
      this.petForm.get('breed')?.reset();
      return;
    }

    // Filtrar razas por speciesId - IMPORTANTE: crear nuevo array
    const filtered = this.allBreeds.filter(b => b.speciesId === species.id);
    
    console.log(`🔥 Razas filtradas para ${species.name} (ID: ${species.id}):`, filtered);
    console.log('🔥 Longitud de filtered:', filtered.length);
    
    // Agregar opción "Otra raza" al final
    const withOther = [...filtered, { id: 999, name: 'Otra raza', speciesId: species.id }];
    
    console.log('🔥 Array final con "Otra raza":', withOther);
    
    // Asignar como nuevo array para que Angular detecte el cambio
    this.filteredBreeds = withOther;
    
    console.log('🔥 filteredBreeds después de asignar:', this.filteredBreeds);
    
    // Reset del control de raza
    this.petForm.get('breed')?.reset();
  }

  // Manejo de la subida de imagen (Previsualización)
  onImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.localImageUrl = e.target.result as string;
          this.petForm.get('imageFile')?.setValue(file);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  savePet() {
    console.log('Form status:', this.petForm.status);
    console.log('Form errors:', this.petForm.errors);
    console.log('Form controls:', Object.keys(this.petForm.controls).map(key => ({
      key,
      valid: this.petForm.get(key)?.valid,
      value: this.petForm.get(key)?.value
    })));

    if (this.petForm.invalid) {
      console.log('Form is invalid, marking all as touched');
      Object.values(this.petForm.controls).forEach(control => {
        control.markAsTouched();
      });
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const formValue = this.petForm.value;
    const selectedSpecies: Species = formValue.species;
    const selectedBreed: Breed = formValue.breed;

    // Validaciones adicionales
    if (!selectedSpecies) {
      alert('Debes seleccionar una especie');
      return;
    }

    if (selectedSpecies.id !== 999 && !selectedBreed) {
      alert('Debes seleccionar una raza');
      return;
    }

    let species = selectedSpecies.id === 999 ? formValue.customSpecies : selectedSpecies.name;
    let breed = selectedBreed && selectedBreed.id !== 999 ? selectedBreed.name : formValue.customBreed;

    // Ajuste para género femenino
    if (formValue.gender === 'Hembra') {
      if (species === 'Perro') species = 'Perra';
      if (species === 'Gato') species = 'Gata';
    }

    const petToSave: Pet = {
      id: formValue.id,
      name: formValue.name,
      speciesId: selectedSpecies.id,
      species: species,
      breedId: selectedBreed?.id,
      breed: breed,
      gender: formValue.gender,
      age: formValue.age,
      imageUrl: formValue.imageUrl || this.localImageUrl || undefined,
      imageFile: formValue.imageFile
    };

    console.log(`Guardando (${this.isEditMode ? 'Edición' : 'Nueva Mascota'})`, petToSave);
    this.formSubmit.emit(petToSave);
  }

  cancel() {
    this.formCancel.emit();
  }
  
  deletePet() {
      if (!this.isEditMode || !this.petData || !this.petData.id) return;

      this.confirmationService.confirm({
        message: `¿Estás seguro que deseas eliminar a "${this.petData.name}"?`,
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptButtonStyleClass: 'p-button-danger',
        rejectButtonStyleClass: 'p-button-secondary',
        accept: () => {
          this.formDelete.emit(this.petData?.id);
        },
        reject: () => {
          // Usuario canceló
        }
      });
  }
}