import { Component, Input } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

/**
 * Componente reutilizable de tarjeta (card) basado en Angular Material.
 * Props principales:
 *  - title, subtitle: encabezados opcionales
 *  - avatar: url de imagen para mat-card-avatar
 *  - icon: icono de material a mostrar en avatar si no hay imagen
 *  - outlined: si true usa apariencia outlined
 *
 * Slots / proyección de contenido:
 *  - contenido principal: <app-card>...contenido...</app-card>
 *  - acciones: <div card-actions>...botones...</div>
 *  - footer: <div card-footer>...pie...</div>
 *
 * Uso recomendado: componente standalone para evitar dependencia de módulos compartidos.
 */
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatDividerModule, NgOptimizedImage],
  template: `
    <mat-card [appearance]="outlined ? 'outlined' : 'filled'" class="app-card">

      @if (avatar || icon || title || subtitle) {
        <mat-card-header>
          @if (avatar) {
            <div mat-card-avatar class="app-card__avatar">
              <img ngSrc="avatar" alt="{{ title || 'avatar' }}" fill/>
            </div>
          } @else if (icon) {
            <mat-icon mat-card-avatar>{{ icon }}</mat-icon>
          }

          @if (title) {
            <mat-card-title>{{ title }}</mat-card-title>
          }

          @if (subtitle) {
            <mat-card-subtitle>{{ subtitle }}</mat-card-subtitle>
          }
        </mat-card-header>
      }

      <mat-card-content>
        <ng-content/>
      </mat-card-content>

      <mat-card-actions>
        <ng-content select="[card-actions]"/>
      </mat-card-actions>

      <mat-divider/>
      <div class="app-card__footer">
        <ng-content select="[card-footer]"/>
      </div>

    </mat-card>
  `,
  styles: [
	`
	  .app-card__avatar img { width: 100%; height: 100%; object-fit: cover; }
	  mat-card { border-radius: 12px; }
	  .app-card__footer { padding: 12px 16px; }
	`,
  ],
})
export class CardComponent {
  /** Título principal */
  @Input() title?: string;
  /** Subtítulo */
  @Input() subtitle?: string;
  /** URL de imagen para avatar */
  @Input() avatar?: string;
  /** Icono de material si no hay avatar */
  @Input() icon?: string;
  /** Usa apariencia outlined (true por defecto) */
  @Input() outlined = true;
}



