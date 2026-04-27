import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-form-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card>
      @if (title) {
        <mat-card-header>
          <mat-card-title>{{ title }}</mat-card-title>
          @if (subtitle) {
            <mat-card-subtitle>{{ subtitle }}</mat-card-subtitle>
          }
        </mat-card-header>
      }

      <mat-card-content>
        <ng-content />
      </mat-card-content>

      @if (actions) {
        <mat-card-actions align="end">
          <ng-content select="[actions]" />
        </mat-card-actions>
      }
    </mat-card>
  `,
})
export class FormCardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;

  /** Si es true, se mostrará el slot [actions]. */
  @Input() actions = false;
}


