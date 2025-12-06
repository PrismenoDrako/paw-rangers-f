import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
  code: string;
}

export interface Breed {
  id: number;
  name: string;
  code: string;
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

  petForm: FormGroup;
  isEditMode: boolean = false;
  localImageUrl: string | null = null;

  genderOptions = [
    { label: 'Macho', value: 'Macho', icon: 'pi pi-mars' },
    { label: 'Hembra', value: 'Hembra', icon: 'pi pi-venus' }
  ];

  // Datos simulados de Species (En producción vendrían de la BD)
  speciesOptions: Species[] = [
      { id: 1, name: 'Perro', code: 'DOG' },
      { id: 2, name: 'Gato', code: 'CAT' },
      { id: 3, name: 'Ave', code: 'BIRD' },
      { id: 4, name: 'Otro', code: 'OTHER' },
  ];

  // Datos simulados de Breeds (En producción vendrían de la BD)
  allBreeds: Breed[] = [
      // Razas de Perros
      { id: 1, name: 'Labrador', code: 'LAB', speciesId: 1 },
      { id: 2, name: 'Schnauzer', code: 'SCHN', speciesId: 1 },
      { id: 3, name: 'Pastor Alemán', code: 'GSD', speciesId: 1 },
      { id: 4, name: 'Mestizo', code: 'MIX_DOG', speciesId: 1 },
      
      // Razas de Gatos
      { id: 5, name: 'Angora Turco', code: 'ANG', speciesId: 2 },
      { id: 6, name: 'Persa', code: 'PERS', speciesId: 2 },
      { id: 7, name: 'Siamés', code: 'SIAM', speciesId: 2 },
      { id: 8, name: 'Mestizo', code: 'MIX_CAT', speciesId: 2 },
      
      // Razas de Aves
      { id: 9, name: 'Canario', code: 'CAN', speciesId: 3 },
      { id: 10, name: 'Loro', code: 'PAR', speciesId: 3 },
      { id: 11, name: 'Loro Verde', code: 'PARV', speciesId: 3 },
      
      // Otros
      { id: 12, name: 'Conejo', code: 'RAB', speciesId: 4 },
      { id: 13, name: 'Hamster', code: 'HAM', speciesId: 4 },
  ];

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
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['petData'] && !changes['petData'].firstChange) {
      // Si petData cambió (no es el primer cambio), reinicializar el formulario
      this.initializeForm();
    }
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
    if (!species) {
      this.filteredBreeds = [];
      this.petForm.get('breed')?.reset();
      return;
    }

    if (species.code === 'OTHER') {
      this.filteredBreeds = [];
      this.petForm.get('breed')?.reset();
    } else {
      this.filteredBreeds = this.allBreeds.filter(b => b.speciesId === species.id);
      // Agregar opción "Otra raza" al final
      this.filteredBreeds.push({ id: 999, name: 'Otra raza', code: 'OTHER', speciesId: species.id });
      this.petForm.get('breed')?.reset();
    }
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

    if (selectedSpecies.code !== 'OTHER' && !selectedBreed) {
      alert('Debes seleccionar una raza');
      return;
    }

    let species = selectedSpecies.code === 'OTHER' ? formValue.customSpecies : selectedSpecies.name;
    let breed = selectedBreed && selectedBreed.code !== 'OTHER' ? selectedBreed.name : formValue.customBreed;

    // Ajuste para género femenino
    if (formValue.gender === 'Hembra') {
      if (species === 'Perro') species = 'Perra';
      if (species === 'Gato') species = 'Gata';
    }

    const petToSave: Pet = {
      id: formValue.id,
      name: formValue.name,
      speciesId: selectedSpecies.code === 'OTHER' ? undefined : selectedSpecies.id,
      species: species,
      breedId: selectedBreed ? selectedBreed.id : undefined,
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