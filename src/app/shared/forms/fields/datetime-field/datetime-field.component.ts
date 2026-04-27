import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-datetime-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  template: `
    <mat-form-field [appearance]="appearance" class="field">
      <mat-label>{{ label }}</mat-label>
      <input matInput type="datetime-local" [formControl]="control" />
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
export class DateTimeFieldComponent {
  @Input({ required: true }) control!: FormControl<string>;
  @Input({ required: true }) label!: string;

  @Input() hint?: string;
  @Input() error?: string;
  @Input() appearance: 'fill' | 'outline' = 'outline';
}


