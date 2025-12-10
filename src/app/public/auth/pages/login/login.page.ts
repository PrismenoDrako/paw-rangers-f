import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthLayout } from '../../auth-layout';
import { AuthService } from '../../../../core/services/auth.service';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AuthLayout,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loading = false;
  error: string | null = null;

  readonly form;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [true],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const { email, password } = this.form.getRawValue();

    this.auth
      .login(email ?? '', password ?? '')
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => this.router.navigate(['/app/home']),
        error: () => (this.error = 'No pudimos iniciar sesion, intenta de nuevo.'),
      });
  }
}
