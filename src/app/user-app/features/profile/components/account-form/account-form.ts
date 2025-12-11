// account-form.ts (NUEVO COMPONENTE)

import { Component, OnInit, Output, EventEmitter } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// Módulos de PrimeNG para el UI
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel'; 
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../../../../../core/services/auth.service';


@Component({
    selector: 'app-account-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule, 
        InputTextModule, 
        ButtonModule,
        FloatLabelModule, 
        AvatarModule
    ],
    templateUrl: './account-form.html', 
    styleUrl: './account-form.scss'
})
export class AccountFormComponent implements OnInit {
    
    profileForm!: FormGroup;

    //Evento que notifica al componente padre (EditProfilePage) cuando se guarda el formulario
    @Output() formSubmitted = new EventEmitter<any>(); 
    //Evento que notifica al componente padre cuando se cancela la edición
    @Output() formCancelled = new EventEmitter<void>();

    constructor(private fb: FormBuilder, private auth: AuthService) {}

    ngOnInit(): void {
        this.initializeForm();
    }

    private initializeForm(): void {
        // Obtener los datos del usuario autenticado
        const authUser = this.auth.user();
        console.log('AccountFormComponent initializeForm - authUser:', authUser);
        
        this.profileForm = this.fb.group({
            nombre: [authUser?.name ?? '', Validators.required],
            apellidoPaterno: [authUser?.apellidoPaterno ?? '', Validators.required],
            apellidoMaterno: [authUser?.apellidoMaterno ?? '', Validators.required],
            username: [authUser?.email?.split('@')[0] ?? '', Validators.required],
            documento: [authUser?.documentId ?? '', Validators.required],
            email: [authUser?.email ?? '', [Validators.required, Validators.email]],
            phone: [authUser?.phone ?? '', Validators.required],
            direccion: [authUser?.address ?? '', Validators.required]
        });
        
        console.log('AccountFormComponent - profileForm inicializado:', this.profileForm.value);
    }

    onSubmit(): void {
        if (this.profileForm.valid) {
            const formValue = this.profileForm.value;
            console.log('AccountFormComponent onSubmit:', formValue);
            
            // Actualizar en el servidor mediante AuthService
            this.auth.updateProfile({
                name: formValue.nombre,
                apellidoPaterno: formValue.apellidoPaterno,
                apellidoMaterno: formValue.apellidoMaterno,
                documentId: formValue.documento,
                phone: formValue.phone,
                address: formValue.direccion,
                email: formValue.email,
            }).subscribe({
                next: (response) => {
                    console.log('Perfil actualizado en el servidor:', response);
                    // Emitir el evento con los datos del formulario al padre
                    this.formSubmitted.emit(formValue);
                },
                error: (err) => {
                    console.error('Error actualizando perfil:', err);
                }
            });
        } else {
            this.profileForm.markAllAsTouched();
            console.warn('Formulario inválido.');
        }
    }

    onCancel(): void {
        // 🚨 Emitir el evento de cancelación al padre
        this.formCancelled.emit();
    }
}
