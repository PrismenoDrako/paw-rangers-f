import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AccountInfoComponent } from '../../components/account-info/account-info';
import { AuthService } from '../../../../../core/services/auth.service';


@Component({
    selector: 'app-edit-profile',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        ButtonModule,
        InputTextModule,
        AvatarModule,
        TooltipModule,
        ToastModule,
        ReactiveFormsModule
    ],
    templateUrl: './edit-profile.html',
    styleUrl: './edit-profile.scss',
    providers: [MessageService]
})
export class EditProfilePage implements OnInit {
    
    profileForm!: FormGroup;
    passwordForm!: FormGroup;
    profileImageUrl: string = '';

    showPasswords = {
        current: false,
        new: false,
        confirm: false
    };

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService,
        private auth: AuthService
    ) {}

    ngOnInit(): void {
        // Cargar la imagen de perfil guardada si existe
        const user = AccountInfoComponent.sharedUser;
        const authUser = this.auth.user();
        this.profileImageUrl = authUser?.profileImage || user.profileImage || '';
        
        this.initializeProfileForm();
        this.initializePasswordForm();
    }

    private initializeProfileForm(): void {
        // Obtener los datos del usuario, priorizando lo que viene de auth
        const authUser = this.auth.user();
        const user = {
            ...AccountInfoComponent.sharedUser,
            nombre: authUser?.name ?? AccountInfoComponent.sharedUser.nombre,
            documento: authUser?.documentId ?? AccountInfoComponent.sharedUser.documento,
            phone: authUser?.phone ?? AccountInfoComponent.sharedUser.phone,
            direccion: authUser?.address ?? AccountInfoComponent.sharedUser.direccion,
            email: authUser?.email ?? AccountInfoComponent.sharedUser.email,
            username: authUser?.email?.split('@')[0] ?? AccountInfoComponent.sharedUser.username,
        };

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

    private initializePasswordForm(): void {
        this.passwordForm = this.fb.group({
            currentPassword: ['', [Validators.required, Validators.minLength(6)]],
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
        }, {
            validators: [this.passwordMatchValidator.bind(this), this.differentPasswordValidator.bind(this), this.currentPasswordValidator.bind(this)]
        });
    }

    private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
        const newPassword = group.get('newPassword')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;

        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        }
        return null;
    }

    private differentPasswordValidator(group: AbstractControl): ValidationErrors | null {
        const currentPassword = group.get('currentPassword')?.value;
        const newPassword = group.get('newPassword')?.value;

        if (currentPassword && newPassword && currentPassword === newPassword) {
            group.get('newPassword')?.setErrors({ samePassword: true });
            return { samePassword: true };
        } else if (group.get('newPassword')?.hasError('samePassword') && currentPassword !== newPassword) {
            const errors = group.get('newPassword')?.errors;
            if (errors) {
                delete errors['samePassword'];
                if (Object.keys(errors).length === 0) {
                    group.get('newPassword')?.setErrors(null);
                }
            }
        }
        return null;
    }

    private currentPasswordValidator(group: AbstractControl): ValidationErrors | null {
        const currentPassword = group.get('currentPassword')?.value;
        const user = AccountInfoComponent.sharedUser;

        if (currentPassword && currentPassword !== user.currentPassword) {
            group.get('currentPassword')?.setErrors({ incorrectPassword: true });
            return { incorrectPassword: true };
        } else if (group.get('currentPassword')?.hasError('incorrectPassword') && currentPassword === user.currentPassword) {
            const errors = group.get('currentPassword')?.errors;
            if (errors) {
                delete errors['incorrectPassword'];
                if (Object.keys(errors).length === 0) {
                    group.get('currentPassword')?.setErrors(null);
                }
            }
        }
        return null;
    }

    togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
        this.showPasswords[field] = !this.showPasswords[field];
    }

    onEditPhoto(): void {
        const fileInput = document.getElementById('profileImageInput') as HTMLInputElement;
        fileInput?.click();
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const files = input.files;

        if (files && files.length > 0) {
            const file = files[0];

            // Validar que sea una imagen
            if (!file.type.startsWith('image/')) {
                console.error('El archivo debe ser una imagen');
                return;
            }

            // Crear un FileReader para leer la imagen
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                // Convertir a base64 y guardar
                this.profileImageUrl = e.target?.result as string;
                console.log('Imagen cargada:', this.profileImageUrl);
            };
            reader.readAsDataURL(file);
        }
    }

    onSubmit(): void {
        if (this.profileForm.valid) {
            console.log('Datos del perfil:', this.profileForm.value);
        }
    }

    onSubmitPassword(): void {
        if (this.passwordForm.valid) {
            console.log('Datos de contraseña:', {
                currentPassword: this.passwordForm.get('currentPassword')?.value,
                newPassword: this.passwordForm.get('newPassword')?.value
            });
        }
    }

    handleSaveAll(): void {
        // Permitir guardar solo el perfil si es v?lido
        if (this.profileForm.valid) {
            const profileData = this.profileForm.value;

            console.log('Guardando perfil:', profileData);

            // Actualizar los datos compartidos con los nuevos valores del perfil
            AccountInfoComponent.sharedUser = {
                ...AccountInfoComponent.sharedUser,
                ...profileData,
                profileImage: this.profileImageUrl || null
            };

            // Persistir en AuthService (mock/localStorage) para que se refleje en perfil y guardias
            this.auth.updateProfile({
                name: profileData.nombre,
                documentId: profileData.documento,
                phone: profileData.phone,
                address: profileData.direccion,
                email: profileData.email,
                profileImage: this.profileImageUrl || undefined,
                password: this.passwordForm.valid && this.passwordForm.get('newPassword')?.value
                    ? this.passwordForm.get('newPassword')?.value
                    : undefined
            });

            // Si el formulario de contrase?a tambi?n es v?lido, guardar la nueva contrase?a
            if (this.passwordForm.valid) {
                const newPassword = this.passwordForm.get('newPassword')?.value;
                console.log('Guardando nueva contrase?a');
                AccountInfoComponent.sharedUser.currentPassword = newPassword;
            }

            this.messageService.add({
                severity: 'success',
                summary: '?xito',
                detail: 'Perfil actualizado correctamente',
                life: 1500
            });

            setTimeout(() => this.router.navigate(['/app/perfil']), 1500);
        } else {
            this.profileForm.markAllAsTouched();
            console.warn('Formulario de perfil inv?lido.');
        }
    }

    handleCancel(): void {
        console.log('Edición cancelada.');
        this.router.navigate(['/app/perfil']);
    }
}
