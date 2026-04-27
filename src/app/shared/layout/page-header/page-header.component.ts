import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="page-header">
      <div class="page-header__text">
        <h1 class="page-header__title">{{ title }}</h1>
        @if (subtitle) {
          <div class="page-header__subtitle">{{ subtitle }}</div>
        }
      </div>

      <div class="page-header__actions">
        <ng-content select="[actions]" />
      </div>
    </div>
  `,
  styles: [
    `
      .page-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 16px;
      }
      .page-header__title {
        margin: 0;
        font-size: 24px;
        line-height: 1.2;
        font-weight: 600;
      }
      .page-header__subtitle {
        color: rgba(0, 0, 0, 0.6);
        margin-top: 4px;
      }
      .page-header__actions {
        display: inline-flex;
        gap: 8px;
        align-items: center;
        justify-content: flex-end;
      }
    `,
  ],
})
export class PageHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
}


