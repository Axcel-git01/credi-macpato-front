import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="empty">
      <mat-icon class="empty__icon">{{ icon }}</mat-icon>
      <div class="empty__title">{{ title }}</div>
      @if (subtitle) {
        <div class="empty__subtitle">{{ subtitle }}</div>
      }
      <div class="empty__actions">
        <ng-content select="[actions]" />
      </div>
    </div>
  `,
  styles: [
    `
      .empty {
        border: 1px dashed rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        padding: 24px;
        text-align: center;
      }
      .empty__icon { font-size: 48px; width: 48px; height: 48px; color: rgba(0,0,0,0.45); }
      .empty__title { margin-top: 8px; font-weight: 600; font-size: 16px; }
      .empty__subtitle { margin-top: 6px; color: rgba(0, 0, 0, 0.6); }
      .empty__actions { margin-top: 16px; display: inline-flex; gap: 8px; }
    `,
  ],
})
export class EmptyStateComponent {
  @Input() title = 'Sin datos';
  @Input() subtitle?: string;
  @Input() icon = 'inbox';
}


