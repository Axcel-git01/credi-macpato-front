import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-date-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <mat-form-field [appearance]="appearance" class="field">
      <mat-label>{{ label }}</mat-label>
      <input matInput [matDatepicker]="picker" [formControl]="control" />
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
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
export class DateFieldComponent {
  @Input({ required: true }) control!: FormControl<Date | null>;
  @Input({ required: true }) label!: string;

  @Input() hint?: string;
  @Input() error?: string;
  @Input() appearance: 'fill' | 'outline' = 'outline';
}


