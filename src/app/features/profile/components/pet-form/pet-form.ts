import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton'; 
import { FileUploadModule } from 'primeng/fileupload';


// --- Interfaces para mejor tipado ---
export interface Pet {
  id?: number;
  name: string;
  species: string;
  breed: string;
  gender: string;
  age: number;
  weight: number;
  imageUrl?: string; // URL después de guardar
  imageFile?: File; // Archivo binario para subir
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
    ReactiveFormsModule, // Añadir ReactiveFormsModule
    ButtonModule, 
    InputTextModule, 
    InputNumberModule, 
    CardModule,
    SelectButtonModule,
    FileUploadModule,
  ],
  templateUrl: './pet-form.html',
  styleUrl: './pet-form.scss'
})
export class PetFormComponent implements OnInit {
  
  @Input() petData: Pet | null = null; // 🚨 Input para auto-relleno
  @Output() formSubmit = new EventEmitter<Pet>();
  @Output() formCancel = new EventEmitter<void>();
  @Output() formDelete = new EventEmitter<number>(); // ✅ CORREGIDO: Unificamos el nombre del evento

  petForm: FormGroup;
  isEditMode: boolean = false;
  localImageUrl: string | ArrayBuffer | null = null; // Para previsualización temporal

  // ✅ CORREGIDO: Restauramos la estructura de objetos para que el HTML pueda mostrar el icono y la etiqueta.
  genderOptions = [
    { label: 'Macho', value: 'Macho', icon: 'pi pi-mars' },
    { label: 'Hembra', value: 'Hembra', icon: 'pi pi-venus' }
  ];

  // 🚨 Opciones (asumiendo datos)
  speciesOptions: DropdownOption[] = [
      { name: 'Perro', code: 'DOG' },
      { name: 'Gato', code: 'CAT' },
      { name: 'Ave', code: 'BIRD' },
      { name: 'Otro', code: 'OTHER' },
  ];
  breedOptions: DropdownOption[] = [
      { name: 'Labrador', code: 'LAB' },
      { name: 'Angora Turco', code: 'ANG' },
      { name: 'Mestizo', code: 'MIX' },
      { name: 'Otro', code: 'OTHER' },
  ];


  constructor(private fb: FormBuilder) {
    this.petForm = this.fb.group({
        id: [null],
        name: ['', Validators.required],
        species: [null, Validators.required],
        customSpecies: [''],
        breed: [null],
        customBreed: [''],
        gender: ['Macho', Validators.required],
        age: [1, [Validators.required, Validators.min(0)]],
        weight: [1, [Validators.required, Validators.min(0.1)]],
        imageFile: [null], // Archivo binario para subir
        imageUrl: [null] // URL existente
    });
  }

  ngOnInit(): void {
    // 🚨 Determinar modo (Editar o Añadir)
    this.isEditMode = !!this.petData && !!this.petData.id;

    // 🚨 Auto-relleno si estamos editando
    if (this.isEditMode && this.petData) {
        // 1. Cargar imagen existente
        this.localImageUrl = this.petData.imageUrl || null; 

        // 2. Setear valores
        this.petForm.patchValue({
            id: this.petData.id,
            name: this.petData.name,
            gender: this.petData.gender,
            age: this.petData.age,
            weight: this.petData.weight,
            imageUrl: this.petData.imageUrl,
        });
        
        // 3. Rellenar campos de Especie (Requiere buscar el objeto)
        this.setDropdownValue('species', this.petData.species, this.speciesOptions, 'customSpecies');

        // 4. Rellenar campos de Raza (Requiere buscar el objeto)
        this.setDropdownValue('breed', this.petData.breed, this.breedOptions, 'customBreed');
    }
  }

  // Función auxiliar para rellenar Dropdowns y campos Custom
  setDropdownValue(controlName: string, storedValue: string, options: DropdownOption[], customControlName: string) {
      // Ajuste para el género, ej: 'Gata' -> 'Gato'
      const baseValue = storedValue.endsWith('a') ? 
                      storedValue.slice(0, -1) + 'o' : 
                      storedValue;

      const option = options.find(opt => opt.name.toLowerCase() === baseValue.toLowerCase());

      if (option) {
          this.petForm.get(controlName)?.setValue(option);
      } else {
          // Si no es una opción predefinida, asumimos 'Otro' y rellenamos el campo custom
          const otherOption = options.find(opt => opt.code === 'OTHER');
          this.petForm.get(controlName)?.setValue(otherOption);
          this.petForm.get(customControlName)?.setValue(storedValue);
      }
  }

  // 🚨 Manejo de la subida de imagen (Previsualización)
  onImageUpload(event: { files: File[] }) {
    // El evento 'onSelect' de p-fileUpload nos da un objeto con los archivos.
    const file = event.files[0];
    if (file) {
      this.petForm.get('imageFile')?.setValue(file); // Guarda el archivo binario
      const reader = new FileReader();
      reader.onload = e => {
        // ✅ CORREGIDO: Aseguramos que el target y el result existan
        if (e.target && e.target.result) {
          this.localImageUrl = e.target.result; // Muestra el preview
        }
      };
      reader.readAsDataURL(file);
    }
  }
  
  // Función para obtener el nombre final de Especie y Raza con ajuste de género
  getPetDisplayNames(formValue: any) {
    let species = formValue.species.code === 'OTHER' ? formValue.customSpecies : formValue.species.name;
    let breed = formValue.breed.code === 'OTHER' ? formValue.customBreed : formValue.breed.name;

    // Ajuste para el género femenino (en español, esto es necesario)
    if (formValue.gender === 'Hembra') {
      if (species === 'Perro') species = 'Perra';
      if (species === 'Gato') species = 'Gata';
    }
    return { species, breed };
  }

  savePet() {
    if (this.petForm.invalid) {
      Object.values(this.petForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    const formValue = this.petForm.value;
    const displayNames = this.getPetDisplayNames(formValue);

    // Creamos el objeto Pet para enviar
    const petToSave: Pet = {
      id: formValue.id,
      name: formValue.name,
      species: displayNames.species,
      breed: displayNames.breed,
      gender: formValue.gender,
      age: formValue.age,
      weight: formValue.weight,
      // 🚨 Mantiene la URL existente si no se sube una nueva.
      imageUrl: this.petForm.get('imageUrl')?.value, 
      // 🚨 Adjunta el archivo binario para que el componente padre lo suba.
      imageFile: this.petForm.get('imageFile')?.value
    };

    console.log(`Guardando (${this.isEditMode ? 'Edición' : 'Nueva Mascota'})`, petToSave);
    this.formSubmit.emit(petToSave);
  }

  cancel() {
    this.formCancel.emit();
  }
  
  // 🚨 Método para ELIMINAR MASCOTA
  deletePet() {
      if (!this.isEditMode || !this.petData || !this.petData.id) return;

      // ✅ Añadimos una confirmación para seguridad
      if (confirm(`¿Estás seguro de que quieres eliminar a ${this.petData.name}? Esta acción es irreversible.`)) {
          this.formDelete.emit(this.petData.id);
      }
  }
}