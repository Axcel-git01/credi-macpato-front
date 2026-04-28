import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-number-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  template: `
    <mat-form-field [appearance]="appearance" class="field">
      <mat-label>{{ label }}</mat-label>
      <input
        matInput
        type="number"
        [formControl]="control"
        [placeholder]="placeholder"
        [attr.min]="min"
        [attr.max]="max"
        [attr.step]="step"
      />
      <!-- Estabiliza DOM para SSR/hydration (evita NG0500) -->
      <mat-hint>{{ hint ?? '\u00A0' }}</mat-hint>
      <mat-error>{{ error ?? '' }}</mat-error>
    </mat-form-field>
  `,
  styles: [`.field{ width: 100%; }`],
})
export class NumberFieldComponent {
  @Input({ required: true }) control!: FormControl<number | null>;
  @Input({ required: true }) label!: string;

  @Input() placeholder = '';
  @Input() hint?: string;
  @Input() error?: string;

  @Input() min?: number | bigint;
  @Input() max?: number | bigint;
  @Input() step?: number | bigint;

  @Input() appearance: 'fill' | 'outline' = 'outline';
}


