import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../services/auth.service';
import { Role, UserRequest, UserState, UserType } from '../models/user.request';
import { ErrorResponse } from '../models/error.response';

import { FormCardComponent } from '../shared/forms/form-card/form-card.component';
import { TextFieldComponent } from '../shared/forms/fields/text-field/text-field.component';
import { PasswordFieldComponent } from '../shared/forms/fields/password-field/password-field.component';
import { NumberFieldComponent } from '../shared/forms/fields/number-field/number-field.component';
import { SelectFieldComponent, SelectOption } from '../shared/forms/fields/select-field/select-field.component';
import { SubmitBarComponent } from '../shared/forms/submit-bar/submit-bar.component';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatRadioModule,
    MatDividerModule,
    FormCardComponent,
    TextFieldComponent,
    PasswordFieldComponent,
    SelectFieldComponent,
    SubmitBarComponent,
    NumberFieldComponent,
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  private userService = inject(UserService);
  private router = inject(Router);

  loading = signal(false);
  errorMsg = signal<string | null>(null);

  // Selecciones de UI
  profile = signal<'MEMBER' | 'ASSOCIATION'>('MEMBER');
  memberRole = signal<'CUSTOMER' | 'VENDOR'>('CUSTOMER');
  memberKind = signal<'PERSON' | 'BUSINESS'>('PERSON');

  roleOptions: SelectOption<'CUSTOMER' | 'VENDOR'>[] = [
    { value: 'CUSTOMER', label: 'Cliente' },
    { value: 'VENDOR', label: 'Vendedor' },
  ];

  kindOptions: SelectOption<'PERSON' | 'BUSINESS'>[] = [
    { value: 'PERSON', label: 'Persona' },
    { value: 'BUSINESS', label: 'Negocio' },
  ];

  form = new FormGroup({
    username: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),

      // Relación con asociación (según los DTO actuales, CustomerRequestDTO también lo requiere)
      associationId: new FormControl<bigint | null>(null),

    // Persona
    name: new FormControl<string>('', { nonNullable: true }),
    lastname: new FormControl<string>('', { nonNullable: true }),

    // Negocio / Asociación
    registrationName: new FormControl<string>('', { nonNullable: true }),
    address: new FormControl<string>('', { nonNullable: true }),
  });

  // helpers
  isAssociation = computed(() => this.profile() === 'ASSOCIATION');
  isMember = computed(() => this.profile() === 'MEMBER');
  isVendor = computed(() => this.memberRole() === 'VENDOR');
  isCustomer = computed(() => this.memberRole() === 'CUSTOMER');
  isPerson = computed(() => this.memberKind() === 'PERSON');
  isBusiness = computed(() => this.memberKind() === 'BUSINESS');

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  onSubmit(): void {
    this.errorMsg.set(null);

    // Validación dinámica mínima
    if (this.form.controls.username.invalid || this.form.controls.password.invalid) {
      this.form.controls.username.markAsTouched();
      this.form.controls.password.markAsTouched();
      this.errorMsg.set('Por favor, completa usuario y contraseña.');
      return;
    }

    const base = {
      username: this.form.controls.username.value,
      password: this.form.controls.password.value,
      state: UserState.ENABLED,
    };

    let payload: UserRequest;

    if (this.isAssociation()) {
      // Asociación
      if (!this.form.controls.registrationName.value || !this.form.controls.address.value) {
        this.errorMsg.set('Completa razón social y dirección.');
        return;
      }

      payload = {
        ...base,
        role: Role.ASSOCIATION,
        type: UserType.ASSOCIATION,
        registrationName: this.form.controls.registrationName.value,
        address: this.form.controls.address.value,
      };
    } else {
      // Miembro: Customer/Vendor + Person/Business
      const assocId: bigint | null = this.form.controls.associationId.value;
      if (assocId === null || assocId === undefined) {
        this.errorMsg.set('associationId es requerido para registrar un miembro.');
        return;
      }

      if (this.isPerson()) {
        if (!this.form.controls.name.value || !this.form.controls.lastname.value) {
          this.errorMsg.set('Completa nombre y apellido.');
          return;
        }

        payload = this.isCustomer()
          ? {
              ...base,
              role: Role.CUSTOMER,
              type: UserType.PERSON_CUSTOMER,

              associationId: assocId,
              name: this.form.controls.name.value,
              lastname: this.form.controls.lastname.value,
            }
          : {
              ...base,
              role: Role.VENDOR,
              type: UserType.PERSON_VENDOR,
              associationId: assocId,
              name: this.form.controls.name.value,
              lastname: this.form.controls.lastname.value,
            };
      } else {
        if (!this.form.controls.registrationName.value || !this.form.controls.address.value) {
          this.errorMsg.set('Completa razón social y dirección.');
          return;
        }

        payload = this.isCustomer()
          ? {
              ...base,
              role: Role.CUSTOMER,
              type: UserType.BUSINESS_CUSTOMER,
              associationId: assocId,
              registrationName: this.form.controls.registrationName.value,
              address: this.form.controls.address.value,
            }
          : {
              ...base,
              role: Role.VENDOR,
              type: UserType.BUSINESS_VENDOR,
              associationId: assocId,
              registrationName: this.form.controls.registrationName.value,
              address: this.form.controls.address.value,
            };
      }
    }

    this.loading.set(true);
    this.userService.register(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/login']);
      },
      error: (err: ErrorResponse) => {
        this.loading.set(false);
        this.errorMsg.set(err.message ?? 'Hubo un error al crear la cuenta. Revisa los datos.');
      },
    });
  }
}
