import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthLayout } from '../../auth-layout';
import { AuthService } from '../../../../core/services/auth.service';
import { DocTypeService } from '../../../../core/services/doctype.service';
import { DocType, RegisterDto } from '../../../../core/models/user.model';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AuthLayout,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  loading = false;
  error: string | null = null;
  showTerms = false;
  showPassword = false;
  showConfirm = false;

  docTypes: DocType[] = [];
  selectedDocTypeLength = 0;

  readonly form;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private docTypeService: DocTypeService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastName1: ['', [Validators.required, Validators.minLength(2)]],
      lastName2: [''],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      docType: ['', Validators.required],
      docNumber: ['', [Validators.required, Validators.minLength(8)]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, Validators.requiredTrue],
    });
  }

  ngOnInit(): void {
    this.loadDocTypes();
    
    // Escuchar cambios en docType para validar dinámicamente docNumber
    this.form.get('docType')?.valueChanges.subscribe((docTypeId) => {
      if (docTypeId) {
        const selectedType = this.docTypes.find(dt => dt.id === parseInt(docTypeId, 10));
        if (selectedType) {
          this.selectedDocTypeLength = selectedType.length;
          // Actualizar validadores dinámicamente
          const docNumberControl = this.form.get('docNumber');
          if (docNumberControl) {
            docNumberControl.setValidators([
              Validators.required,
              Validators.minLength(selectedType.length),
              Validators.maxLength(selectedType.length),
              this.numericValidator()
            ]);
            docNumberControl.updateValueAndValidity();
          }
        }
      }
    });
  }

  onDocTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const docTypeId = parseInt(selectElement.value, 10);
    
    if (docTypeId) {
      const selectedType = this.docTypes.find(dt => dt.id === docTypeId);
      if (selectedType) {
        this.selectedDocTypeLength = selectedType.length;
        // Actualizar validadores dinámicamente
        const docNumberControl = this.form.get('docNumber');
        if (docNumberControl) {
          docNumberControl.setValidators([
            Validators.required,
            Validators.minLength(selectedType.length),
            Validators.maxLength(selectedType.length),
            this.numericValidator()
          ]);
          docNumberControl.updateValueAndValidity();
        }
      }
    }
  }

  private loadDocTypes(): void {
    this.docTypeService.getDocTypes().subscribe({
      next: (response) => {
        this.docTypes = response.data || [];
      },
      error: (error) => {
        console.error('Error cargando tipos de documento:', error);
        this.error = 'No pudimos cargar los tipos de documento. Intenta de nuevo.';
      }
    });
  }

  private numericValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const isNumeric = /^\d+$/.test(control.value);
      return isNumeric ? null : { notNumeric: true };
    };
  }

  onSubmit(): void {
    if (this.form.invalid || this.form.value.password !== this.form.value.confirmPassword) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const { email, username, password, name, lastName1, lastName2, docType, docNumber } = this.form.getRawValue();

    const registerDto: RegisterDto = {
      email: email ?? '',
      username: username ?? '',
      password: password ?? '',
      name: name ?? '',
      lastName1: lastName1 ?? '',
      lastName2: lastName2 || undefined,
      docTypeId: parseInt(docType ?? '0', 10),
      docNumber: docNumber ?? '',
    };

    this.auth
      .register(registerDto)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => this.router.navigate(['/app']),
        error: (err) =>
          (this.error =
            err?.message ||
            'No pudimos crear la cuenta. Verifica que el correo no esté registrado e inténtalo de nuevo.'),
      });
  }

  openTerms(event?: Event): void {
    event?.preventDefault();
    this.showTerms = true;
  }

  closeTerms(): void {
    this.showTerms = false;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirm(): void {
    this.showConfirm = !this.showConfirm;
  }

  /**
   * Limita el input de docNumber a solo números y respeta la longitud máxima
   */
  onDocNumberInput(event: any): void {
    const input = event.target;
    let value = input.value.replace(/\D/g, ''); // Solo números
    
    if (this.selectedDocTypeLength > 0) {
      value = value.substring(0, this.selectedDocTypeLength);
    }
    
    input.value = value;
    this.form.patchValue({ docNumber: value }, { emitEvent: false });
  }
}

