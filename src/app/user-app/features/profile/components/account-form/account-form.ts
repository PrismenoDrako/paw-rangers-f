// account-form.ts (NUEVO COMPONENTE)

import { Component, OnInit, Output, EventEmitter } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// Módulos de PrimeNG para el UI
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel'; 
import { AvatarModule } from 'primeng/avatar';
import { AccountInfoComponent } from '../account-info/account-info';
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
        // Obtener los datos del usuario compartidos desde account-info
        const user = AccountInfoComponent.sharedUser;
        this.profileForm = this.fb.group({
            nombre: [user.nombre, Validators.required],
            apellidoPaterno: [user.apellidoPaterno, Validators.required],
            apellidoMaterno: [user.apellidoMaterno, Validators.required],
            username: [user.username, Validators.required],
            documento: [user.documento, Validators.required],
            email: [user.email, [Validators.required, Validators.email]],
            phone: [user.phone, Validators.required],
            direccion: [user.direccion, Validators.required]
        });
    }

    onSubmit(): void {
        if (this.profileForm.valid) {
            // Actualizar los datos compartidos con los nuevos valores del formulario
            AccountInfoComponent.sharedUser = {
                ...AccountInfoComponent.sharedUser,
                ...this.profileForm.value
            };
            // Persistir en AuthService mock/local
            const formValue = this.profileForm.value;
            this.auth.updateProfile({
                name: formValue.nombre,
                documentId: formValue.documento,
                phone: formValue.phone,
                address: formValue.direccion,
                email: formValue.email,
            });
            // Emitir el evento con los datos del formulario al padre
            this.formSubmitted.emit(this.profileForm.value);
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
