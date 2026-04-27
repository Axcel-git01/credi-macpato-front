import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

export interface SelectOption<T> {
  value: T;
  label: string;
}

@Component({
  selector: 'app-select-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  template: `
    <mat-form-field [appearance]="appearance" class="field">
      <mat-label>{{ label }}</mat-label>
      <mat-select
        [value]="control ? control.value : value"
        (selectionChange)="onSelectionChange($event.value)">
        @for (opt of options; track opt.label) {
          <mat-option [value]="opt.value">{{ opt.label }}</mat-option>
        } @empty {
          <mat-option [disabled]="true">Sin opciones</mat-option>
        }
      </mat-select>
      @if (hint) {
        <mat-hint>{{ hint }}</mat-hint>
      }
      @if (error) {
        <mat-error>{{ error }}</mat-error>
      }
    </mat-form-field>
  `,
  styles: [`.field{ width: 100%; }`],
})
export class SelectFieldComponent<T> {
  /**
   * Modo 1 (recomendado): pasar FormControl.
   * Modo 2: si no usas reactive forms, puedes pasar value + valueChange.
   */
  @Input() control?: FormControl<T | null>;
  @Input() value: T | null = null;
  @Output() valueChange = new EventEmitter<T>();
  @Input({ required: true }) label!: string;
  @Input({ required: true }) options: readonly SelectOption<T>[] = [];

  @Input() hint?: string;
  @Input() error?: string;
  @Input() appearance: 'fill' | 'outline' = 'outline';

  onSelectionChange(v: T): void {
    if (this.control) {
      this.control.setValue(v);
      return;
    }
    this.value = v;
    this.valueChange.emit(v);
  }
}


