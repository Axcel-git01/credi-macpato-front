import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

import { MatFormFieldModule, FloatLabelType } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-text-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  template: `
    <mat-form-field [appearance]="appearance" class="field" [floatLabel]="floatLabel">
      <mat-label>{{ label }}</mat-label>
      <input
        matInput
        [type]="type"
        [placeholder]="placeholder"
        [formControl]="control"
        [autocomplete]="autocomplete"
      />
      <!-- Estabiliza DOM para SSR/hydration (evita NG0500) -->
      <mat-hint>{{ hint ?? '\u00A0' }}</mat-hint>
      <mat-error>{{ error ?? '' }}</mat-error>
    </mat-form-field>
  `,
  styles: [`.field{ width: 100%; }`],
})
export class TextFieldComponent {
  @Input({ required: true }) control!: FormControl<string>;
  @Input({ required: true }) label!: string;

  @Input() placeholder = '';
  @Input() hint?: string;
  @Input() error?: string;

  @Input() type: 'text' | 'email' | 'tel' | 'url' | 'search' = 'text';
  @Input() autocomplete = 'off';
  @Input() appearance: 'fill' | 'outline' = 'outline';
  @Input() floatLabel: FloatLabelType = 'auto';
}


