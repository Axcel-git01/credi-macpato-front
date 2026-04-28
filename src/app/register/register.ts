import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';

import { Role, UserRequest, UserState, UserType } from '../models/user.request';
import { ErrorResponse } from '../models/error.response';

import { FormCardComponent } from '../shared/forms/form-card/form-card.component';
import { TextFieldComponent } from '../shared/forms/fields/text-field/text-field.component';
import { PasswordFieldComponent } from '../shared/forms/fields/password-field/password-field.component';
import { SelectFieldComponent, SelectOption } from '../shared/forms/fields/select-field/select-field.component';
import { SubmitBarComponent } from '../shared/forms/submit-bar/submit-bar.component';
import {UserService} from '../services/user.service';
import { ToastService } from '../shared/ui/toast/toast.service';
import { AssociationService } from '../services/association.service';
import { AssociationResponseDTO } from '../models/user.response';

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
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  private userService = inject(UserService);
  private associationService = inject(AssociationService);
  private router = inject(Router);
  private toast = inject(ToastService);

  loading = signal(false);
  errorMsg = signal<string | null>(null);
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

  associationsLoading = signal(false);
  associations = signal<AssociationResponseDTO[]>([]);
  associationOptions = computed((): SelectOption<string>[] =>
    this.associations().map((a) => ({
      value: String((a as unknown as { id: bigint }).id),
      label: a.registrationName ?? a.fullName ?? a.username,
    }))
  );

  form = new FormGroup({
    username: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),

    associationId: new FormControl<string | null>(null, { validators: [Validators.required] }),

    name: new FormControl<string>('', { nonNullable: true }),
    lastname: new FormControl<string>('', { nonNullable: true }),

    registrationName: new FormControl<string>('', { nonNullable: true }),
    address: new FormControl<string>('', { nonNullable: true }),
  });

  isAssociation = computed(() => this.profile() === 'ASSOCIATION');
  isMember = computed(() => this.profile() === 'MEMBER');
  isCustomer = computed(() => this.memberRole() === 'CUSTOMER');
  isPerson = computed(() => this.memberKind() === 'PERSON');

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  constructor() {
    this.loadAssociations();
  }

  private loadAssociations(): void {
    this.associationsLoading.set(true);
    this.associationService.listAll().subscribe({
      next: (items) => {
        this.associations.set(items as AssociationResponseDTO[]);
        this.associationsLoading.set(false);
        console.table(items);
      },
      error: (err: HttpErrorResponse) => {
        this.associationsLoading.set(false);
        const apiError = err.error as ErrorResponse | undefined;
        this.toast.error(apiError?.message ?? 'No se pudieron cargar las asociaciones.');
      },
    });
  }

  onAssociationSelected(id: string | null): void {
    if (!id) {
      this.form.controls.associationId.setValue(null);
      return;
    }
    this.form.controls.associationId.setValue(id);
  }

  onSubmit(): void {
    this.errorMsg.set(null);

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
      const assocId: string | null = this.form.controls.associationId.value;
      if (assocId === null || assocId === undefined) {
        this.errorMsg.set('Selecciona una asociación para registrar un miembro.');
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
        this.toast.success('Cuenta creada correctamente. Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        const apiError = err.error as ErrorResponse | undefined;
        this.toast.error(apiError?.message ?? 'Hubo un error al crear la cuenta, revisa los datos.');
      },
    });
  }
}
