// account-info.component.ts

import { Component, Input, OnInit, ViewChild } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

// PrimeNG Modules
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputMaskModule } from 'primeng/inputmask';
import { FileUploadModule, FileUpload } from 'primeng/fileupload'; 
import { CardModule } from 'primeng/card'; 

@Component({
  selector: 'app-account-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AvatarModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    InputMaskModule,
    FileUploadModule,
    CardModule 
  ],
  templateUrl: './account-info.html',
  styleUrl: './account-info.scss'
})
export class AccountInfoComponent implements OnInit {
  
  // 🚨 CORRECCIÓN: Referencia al componente de subida de archivo
  @ViewChild('fileUpload') fileUpload!: FileUpload; 

  isEditing: boolean = false; 
  userData: any = {};
  originalUserData: any = {};

  @Input() profileImageUrl: string = 'https://marketplace.canva.com/gJly0/MAGDkMgJly0/1/tl/canva-user-profile-icon-vector.-avatar-or-person-icon.-profile-picture%2C-portrait-symbol.-MAGDkMgJly0.png'; 

  ngOnInit(): void {
      this.userData = {
          username: 'danielino06', 
          nombre: 'Daniel', 
          apellidoPaterno: 'Vega Bazán',
          apellidoMaterno: 'Llontop',
          email: 'danielino@gmail.com',
          phone: '+51 927 165 937',
          direccion: 'Urb Lourdes Mz A Dto 101',
          password: '',
          confirmPassword: ''
      };
      
      this.originalUserData = { ...this.userData };
  }

  onEditProfile(): void {
    if (this.isEditing) {
      this.saveChanges();
    } else {
      this.isEditing = true;
    }
  }

  cancelEditing(): void {
    this.userData = { ...this.originalUserData };
    this.isEditing = false;
  }

  saveChanges(): void {
    console.log('Datos a guardar:', this.userData);
    this.originalUserData = { ...this.userData }; 
    this.isEditing = false;
  }
  
  // 🚨 CORRECCIÓN: Nuevo método para activar el diálogo de subida de archivo
  onAvatarClick(): void {
    if (this.fileUpload) {
        // En lugar de .click() en el objeto Angular, usamos el método 'choose()' de PrimeNG
        this.fileUpload.choose(); 
    }
  }
  
  onUpload(event: any) {
      const file = event.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
              this.profileImageUrl = e.target.result;
          };
          reader.readAsDataURL(file);
          console.log('Nueva foto seleccionada:', file.name);
      }
  }
}