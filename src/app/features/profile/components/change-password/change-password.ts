import { Component, OnInit, Output, EventEmitter } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
// Módulos de PrimeNG para el UI
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'app-change-password',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule, 
        InputTextModule, 
        ButtonModule,
        FloatLabelModule,
        MessageModule
    ],
    templateUrl: './change-password.html', 
    styleUrl: './change-password.scss'
})
export class ChangePasswordComponent implements OnInit {
    
    passwordForm!: FormGroup;
    showPasswords = {
        current: false,
        new: false,
        confirm: false
    };

    @Output() formSubmitted = new EventEmitter<any>(); 
    @Output() formCancelled = new EventEmitter<void>();

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.initializeForm();
    }

    private initializeForm(): void {
        this.passwordForm = this.fb.group({
            currentPassword: ['', [Validators.required, Validators.minLength(6)]],
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
        }, {
            validators: this.passwordMatchValidator
        });
    }

    /**
     * Validador personalizado para verificar que las contraseñas coinciden
     */
    private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
        const newPassword = group.get('newPassword')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;

        if (newPassword !== confirmPassword) {
            group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        }
        return null;
    }

    /**
     * Alterna la visibilidad de la contraseña
     */
    togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
        this.showPasswords[field] = !this.showPasswords[field];
    }

    onSubmit(): void {
        if (this.passwordForm.valid) {
            this.formSubmitted.emit({
                currentPassword: this.passwordForm.get('currentPassword')?.value,
                newPassword: this.passwordForm.get('newPassword')?.value
            });
        } else {
            this.passwordForm.markAllAsTouched();
            console.warn('Formulario inválido.');
        }
    }

    onCancel(): void {
        this.formCancelled.emit();
        this.passwordForm.reset();
    }
}
