import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-submit-bar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <div class="bar">
      <button mat-button type="button" (click)="cancel.emit()" [disabled]="loading">{{ cancelText }}</button>

      <button mat-flat-button color="primary" type="submit" [disabled]="disabled || loading" (click)="submit.emit()">
        @if (loading) {
          <mat-progress-spinner diameter="18" mode="indeterminate" class="bar__spinner" />
        }
        <span>{{ submitText }}</span>
      </button>
    </div>
  `,
  styles: [
    `
      .bar { display: flex; justify-content: flex-end; gap: 8px; align-items: center; margin-top: 16px; }
      .bar__spinner { display: inline-block; margin-right: 8px; }
    `,
  ],
})
export class SubmitBarComponent {
  @Input() submitText = 'Guardar';
  @Input() cancelText = 'Cancelar';
  @Input() loading = false;
  @Input() disabled = false;

  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
}


