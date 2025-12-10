import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthLayout } from '../../auth-layout';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AuthLayout],
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  readonly token: string;
  readonly form;

  updated = false;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.form.value.password !== this.form.value.confirmPassword) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const { password } = this.form.getRawValue();

    this.auth
      .resetPassword(this.token, password ?? '')
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.updated = true;
          setTimeout(() => this.router.navigate(['/auth']), 800);
        },
        error: () => (this.error = 'No pudimos actualizar tu contraseña, intenta de nuevo.'),
      });
  }
}
