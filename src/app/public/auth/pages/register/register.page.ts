import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthLayout } from '../../auth-layout';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AuthLayout],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  loading = false;
  error: string | null = null;
  showTerms = false;
  showPassword = false;
  showConfirm = false;

  readonly form;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [true, Validators.requiredTrue],
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.form.value.password !== this.form.value.confirmPassword) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const { email, password, name } = this.form.getRawValue();

    this.auth
      .register(email ?? '', password ?? '', name ?? '')
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => this.router.navigate(['/app/home']),
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
}
