import {
  AssociationRequestDTO,
  BusinessCustomerRequestDTO,
  BusinessVendorRequestDTO, CustomerRequestDTO, PersonCustomerRequestDTO, PersonVendorRequestDTO,
  Role,
  UserRequest,
  UserState,
  UserType, VendorRequestDTO
} from '../../../models/user.request';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Component, EventEmitter, inject, Input, OnDestroy, Output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {
  AssociationResponseDTO, BusinessCustomerResponseDTO, BusinessVendorResponseDTO,
  CustomerResponseDTO,
  PersonCustomerResponseDTO, PersonVendorResponseDTO,
  UserResponse, VendorResponseDTO
} from '../../../models/user.response';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="outline" class="field">
        <mat-label>Usuario</mat-label>
        <input matInput formControlName="username" />
        @if (form.get('username')?.invalid && form.get('username')?.touched) {
          <mat-error>Usuario requerido</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline" class="field">
        <mat-label>Contraseña</mat-label>
        <input matInput type="password" formControlName="password" />
        @if (form.get('password')?.invalid && form.get('password')?.touched) {
          <mat-error>Contraseña requerida</mat-error>
        }
      </mat-form-field>

      @switch (userType) {
        @case ('ASSOCIATION') {
          <mat-form-field appearance="outline" class="field">
            <mat-label>Razón social</mat-label>
            <input matInput formControlName="registrationName" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="field">
            <mat-label>Dirección</mat-label>
            <input matInput formControlName="address" />
          </mat-form-field>
        }
        @case ('PERSON_CUSTOMER') {
          <mat-form-field appearance="outline" class="field">
            <mat-label>Nombre</mat-label>
            <input matInput formControlName="name" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="field">
            <mat-label>Apellido</mat-label>
            <input matInput formControlName="lastname" />
          </mat-form-field>
        }
        @case ('BUSINESS_CUSTOMER') {
          <mat-form-field appearance="outline" class="field">
            <mat-label>Razón social</mat-label>
            <input matInput formControlName="registrationName" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="field">
            <mat-label>Dirección</mat-label>
            <input matInput formControlName="address" />
          </mat-form-field>
        }
        @case ('PERSON_VENDOR') {
          <mat-form-field appearance="outline" class="field">
            <mat-label>Nombre</mat-label>
            <input matInput formControlName="name" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="field">
            <mat-label>Apellido</mat-label>
            <input matInput formControlName="lastname" />
          </mat-form-field>
        }
        @case ('BUSINESS_VENDOR') {
          <mat-form-field appearance="outline" class="field">
            <mat-label>Razón social</mat-label>
            <input matInput formControlName="registrationName" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="field">
            <mat-label>Dirección</mat-label>
            <input matInput formControlName="address" />
          </mat-form-field>
        }
      }

      <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:12px;">
        <button mat-stroked-button type="button" (click)="onCancel()">
          <mat-icon>close</mat-icon>
          Cancelar
        </button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || saving()">
          <mat-icon>save</mat-icon>
          Guardar
        </button>
      </div>
    </form>
  `,
})
export class UserFormComponent implements OnDestroy {

  private fb = inject(FormBuilder);

  @Input() set initial(val: UserResponse | null) {
    if (!val) return;

    this.userType   = this.resolveUserType(val);
    this.fixedValues = {};
    this.isEditMode  = true;

    this.fixedValues.id        = val.id;
    this.fixedValues.createdAt = val.createdAt;

    if ('associationId' in val) {
      this.fixedValues.associationId = String((val as CustomerResponseDTO | VendorResponseDTO).associationId);
    }

    this.form.reset({}, { emitEvent: false });
    this.form.enable({ emitEvent: false });

    this.form.get('password')!.clearValidators();
    this.form.get('password')!.updateValueAndValidity({ emitEvent: false });

    this.form.patchValue({
      username: val.username,
      password: '',
      ...('registrationName' in val ? { registrationName: (val as AssociationResponseDTO | BusinessCustomerResponseDTO | BusinessVendorResponseDTO).registrationName } : {}),
      ...('address'          in val ? { address:          (val as AssociationResponseDTO | BusinessCustomerResponseDTO | BusinessVendorResponseDTO).address }          : {}),
      ...('name'             in val ? { name:             (val as PersonCustomerResponseDTO | PersonVendorResponseDTO).name }             : {}),
      ...('lastname'         in val ? { lastname:         (val as PersonCustomerResponseDTO | PersonVendorResponseDTO).lastname }         : {}),
    }, { emitEvent: false });

    if ('associationId' in val) {
      const ctrl = this.form.get('associationId')!;
      ctrl.setValue(this.fixedValues.associationId, { emitEvent: false });
      ctrl.disable({ emitEvent: false });
    }
  }

  @Output() save   = new EventEmitter<UserRequest>();
  @Output() cancel = new EventEmitter<void>();

  saving     = signal(false);
  userType   = UserType.PERSON_CUSTOMER;
  isEditMode = false;

  private fixedValues: {
    id?           : bigint;
    createdAt?    : Date;
    associationId?: string;
  } = {};

  form: FormGroup = this.fb.group({
    username        : ['', Validators.required],
    password        : ['', Validators.required],
    registrationName: [''],
    address         : [''],
    name            : [''],
    lastname        : [''],
    associationId   : [''],
  });

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.saving.set(true);

    try {
      const raw = this.form.getRawValue();

      const builders: Record<UserType, (r: any) => UserRequest> = {

        [UserType.ASSOCIATION]: (r) => ({
          ...(this.isEditMode && { id: this.fixedValues.id, createdAt: this.fixedValues.createdAt }),
          username        : r.username,
          password        : r.password,
          role            : Role.ASSOCIATION,
          state           : UserState.ENABLED,
          type            : UserType.ASSOCIATION,
          registrationName: r.registrationName,
          address         : r.address,
        }),

        [UserType.PERSON_CUSTOMER]: (r) => ({
          ...(this.isEditMode && { id: this.fixedValues.id, createdAt: this.fixedValues.createdAt }),
          username     : r.username,
          password     : r.password,
          role         : Role.CUSTOMER,
          state        : UserState.ENABLED,
          type         : UserType.PERSON_CUSTOMER,
          associationId: this.fixedValues.associationId!,
          name         : r.name,
          lastname     : r.lastname,
        }),

        [UserType.BUSINESS_CUSTOMER]: (r) => ({
          ...(this.isEditMode && { id: this.fixedValues.id, createdAt: this.fixedValues.createdAt }),
          username        : r.username,
          password        : r.password,
          role            : Role.CUSTOMER,
          state           : UserState.ENABLED,
          type            : UserType.BUSINESS_CUSTOMER,
          associationId   : this.fixedValues.associationId!,
          registrationName: r.registrationName,
          address         : r.address,
        }),

        [UserType.PERSON_VENDOR]: (r) => ({
          ...(this.isEditMode && { id: this.fixedValues.id, createdAt: this.fixedValues.createdAt }),
          username     : r.username,
          password     : r.password,
          role         : Role.VENDOR,
          state        : UserState.ENABLED,
          type         : UserType.PERSON_VENDOR,
          associationId: this.fixedValues.associationId!,
          name         : r.name,
          lastname     : r.lastname,
        }),

        [UserType.BUSINESS_VENDOR]: (r) => ({
          ...(this.isEditMode && { id: this.fixedValues.id, createdAt: this.fixedValues.createdAt }),
          username        : r.username,
          password        : r.password,
          role            : Role.VENDOR,
          state           : UserState.ENABLED,
          type            : UserType.BUSINESS_VENDOR,
          associationId   : this.fixedValues.associationId!,
          registrationName: r.registrationName,
          address         : r.address,
        }),
      };

      const payload = builders[this.userType](raw);
      this.save.emit(payload);
      console.table(payload);

    } finally {
      this.saving.set(false);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  ngOnDestroy(): void {
    this.saving.set(false);
  }

  private resolveUserType(val: UserResponse): UserType {
    if ('registrationName' in val && !('associationId' in val)) return UserType.ASSOCIATION;
    if ('name' in val) {
      return 'moneyBalance' in val ? UserType.PERSON_VENDOR : UserType.PERSON_CUSTOMER;
    }
    if ('registrationName' in val) {
      return 'moneyBalance' in val ? UserType.BUSINESS_VENDOR : UserType.BUSINESS_CUSTOMER;
    }
    return UserType.PERSON_CUSTOMER;
  }
}
