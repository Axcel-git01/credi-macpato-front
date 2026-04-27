import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { LoginRequestDTO } from '../../models/login';
import { ErrorResponse } from '../../models/error.response';

import { FormCardComponent } from '../../shared/forms/form-card/form-card.component';
import { TextFieldComponent } from '../../shared/forms/fields/text-field/text-field.component';
import { PasswordFieldComponent } from '../../shared/forms/fields/password-field/password-field.component';
import { SubmitBarComponent } from '../../shared/forms/submit-bar/submit-bar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormCardComponent,
    TextFieldComponent,
    PasswordFieldComponent,
    SubmitBarComponent,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  errorMsj = signal<string | null>(null);

  form = new FormGroup({
    username: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  });

  goToRegister() {
    this.router.navigate(['/register']);
  }

  onLogin() {
    this.errorMsj.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMsj.set('Por favor, completa todos los campos.');
      return;
    }

    const datosLogin: LoginRequestDTO = {
      username: this.form.controls.username.value,
      password: this.form.controls.password.value,
    };

    this.loading.set(true);
    this.authService.login(datosLogin).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        const apiError = err.error as ErrorResponse | undefined;
        this.errorMsj.set(apiError?.message ?? 'Usuario o contraseña incorrectos.');
      },
    });
  }
}
