import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-password-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <mat-form-field [appearance]="appearance" class="field">
      <mat-label>{{ label }}</mat-label>
      <input matInput [type]="hidden() ? 'password' : 'text'" [formControl]="control" />
      <button mat-icon-button matSuffix type="button" (click)="toggle()" [attr.aria-label]="'Mostrar contraseña'">
        <mat-icon>{{ hidden() ? 'visibility' : 'visibility_off' }}</mat-icon>
      </button>
      <!-- Estabiliza DOM para SSR/hydration (evita NG0500) -->
      <mat-hint>{{ hint ?? '\u00A0' }}</mat-hint>
      <mat-error>{{ error ?? '' }}</mat-error>
    </mat-form-field>
  `,
  styles: [`.field{ width: 100%; }`],
})
export class PasswordFieldComponent {
  @Input({ required: true }) control!: FormControl<string>;
  @Input({ required: true }) label!: string;

  @Input() hint?: string;
  @Input() error?: string;
  @Input() appearance: 'fill' | 'outline' = 'outline';

  protected hidden = signal(true);

  toggle(): void {
    this.hidden.update(v => !v);
  }
}


