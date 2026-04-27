import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    @if (loading) {
      <div class="overlay">
        <mat-progress-spinner diameter="40" mode="indeterminate" />
        @if (text) {
          <div class="overlay__text">{{ text }}</div>
        }
      </div>
    }
  `,
  styles: [
    `
      .overlay {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 24px;
      }
      .overlay__text { color: rgba(0, 0, 0, 0.7); }
    `,
  ],
})
export class LoadingOverlayComponent {
  @Input() loading = false;
  @Input() text?: string;
}


