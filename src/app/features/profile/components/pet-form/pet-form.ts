import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card'; 
import { SelectButtonModule } from 'primeng/selectbutton'; 
import { FileUploadModule } from 'primeng/fileupload'; // 🚨 NUEVO: Para subir archivos

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ButtonModule, 
    InputTextModule, 
    InputNumberModule, 
    CardModule,
    SelectButtonModule,
    FileUploadModule // ✅ Importado
  ],
  templateUrl: './pet-form.html',
  styleUrls: ['./pet-form.scss']
})
export class PetFormComponent implements OnInit {
  
  @Input() petData: any = null; 
  
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  petForm: any = {};
  isEditMode: boolean = false;
  
  // 🚨 NUEVO: Para manejar la previsualización de la imagen local
  localImageUrl: string | ArrayBuffer | null = null; 

  genderOptions = [
    { label: 'Macho', value: 'Macho', icon: 'pi pi-mars' },
    { label: 'Hembra', value: 'Hembra', icon: 'pi pi-venus' }
  ];

  ngOnInit(): void {
    if (this.petData && this.petData.id) {
      this.isEditMode = true;
      this.petForm = { ...this.petData }; 
      // Si estamos editando y ya tiene una URL, la usamos para la previsualización
      this.localImageUrl = this.petData.imageUrl; 
    } else {
      this.isEditMode = false;
      this.petForm = { 
        id: null, 
        name: '', 
        age: 0, 
        weight: 0, 
        species: '', 
        breed: '', 
        gender: this.genderOptions[0].value 
      };
      this.localImageUrl = null;
    }
  }

  // 🚨 NUEVO MÉTODO: Manejar la selección del archivo
  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      // Leer el archivo para la previsualización
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.localImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      
      // Asignar el objeto File al formulario para que el padre lo envíe.
      this.petForm.imageFile = file; 
      // Opcionalmente, puedes mantener la imageUrl anterior hasta que se guarde.
    }
  }

  savePet() {
    // Aquí el objeto petForm ya tiene el id (si es edición) y el imageFile (si se subió).
    console.log(`Guardando (${this.isEditMode ? 'Edición' : 'Adición'}):`, this.petForm);
    this.formSubmit.emit(this.petForm); 
  }

  cancel() {
    this.formCancel.emit(); 
  }
}