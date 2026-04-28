import { Component, EventEmitter, Input, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { StandRequestDTO } from '../../models/stand';


@Component({
  selector: 'app-stand-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="outline" class="field">
        <mat-label>Descripción</mat-label>
        <input matInput formControlName="description" />
        @if (form.get('description')?.invalid && form.get('description')?.touched) {
          @if (form.get('description')?.errors?.['required']) {
            <mat-error>La descripción es obligatoria</mat-error>
          } @else if (form.get('description')?.errors?.['maxlength']) {
            <mat-error>Máximo 255 caracteres</mat-error>
          }
        }
      </mat-form-field>

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
export class StandFormComponent {
  private fb = inject(FormBuilder);

  @Input() set initial(val: StandRequestDTO | undefined) {
    if (!val) return;
    this.form.patchValue({ description: val.description ?? '' }, { emitEvent: false });
  }

  @Input() set ownerId(val: string | null) {
    if (!val) return;
    this.ownerIdValue = val;
  }

  @Output() save   = new EventEmitter<StandRequestDTO>();
  @Output() cancel = new EventEmitter<void>();

  saving       = signal(false);
  ownerIdValue = '';

  form = this.fb.group({
    description: ['', [Validators.required, Validators.maxLength(255)]],
  });

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || !this.ownerIdValue) return;

    this.saving.set(true);
    try {
      const payload: StandRequestDTO = {
        ownerId    : this.ownerIdValue,
        description: this.form.value.description!,
      };
      this.save.emit(payload);
    } finally {
      this.saving.set(false);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}





