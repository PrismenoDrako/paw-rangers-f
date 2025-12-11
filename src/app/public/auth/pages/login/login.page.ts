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
      username: ['', [Validators.required, Validators.minLength(3)]],
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

    const { username, password } = this.form.getRawValue();

    this.auth
      .login(username ?? '', password ?? '')
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          // Redirigir según el rol del usuario
          if (this.auth.isAdmin()) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/app']);
          }
        },
        error: (err) => (this.error = err?.message || 'No pudimos iniciar sesión, intenta de nuevo.'),
      });
  }
}

