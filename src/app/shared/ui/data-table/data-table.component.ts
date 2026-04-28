import { Component, Input, TemplateRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  cell?: (row: T) => string | number | null | undefined;
  hideOnHandset?: boolean;
  template?: TemplateRef<{ $implicit: T }>
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule],
  template: `
    @if (columns.length) {
      <table mat-table [dataSource]="rows" class="mat-elevation-z1">
        @for (col of columns; track col.key) {
          <ng-container [matColumnDef]="col.key">
            <th mat-header-cell *matHeaderCellDef> {{ col.header }} </th>
            <td mat-cell *matCellDef="let row">
              @if (col.template) {
                <ng-container *ngTemplateOutlet="col.template; context: { $implicit: row }" />
              } @else {
                {{ col.cell?.(row) ?? valueOf(row, col.key) }}
              }
            </td>
          </ng-container>
        }

        <tr mat-header-row *matHeaderRowDef="displayedColumnKeys"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumnKeys"></tr>

        @if (!rows.length) {
          <tr class="mat-row">
            <td class="mat-cell" [attr.colspan]="displayedColumnKeys.length" style="padding:16px; text-align:center;">
              @if (emptyTemplate) {
                <ng-container *ngTemplateOutlet="emptyTemplate" />
              } @else {
                {{ emptyText }}
              }
            </td>
          </tr>
        }
      </table>
    }
  `,
  styles: [
    `
      table { width: 100%; border-radius: 12px; overflow: hidden; }
      th { font-weight: 600; }
    `,
  ],
})
export class DataTableComponent<T> {
  @Input({ required: true }) rows: readonly T[] = [];
  @Input({ required: true }) columns: readonly DataTableColumn<T>[] = [];
  private bp = inject(BreakpointObserver);
  private isHandset = signal(false);

  constructor() {
    this.bp.observe([Breakpoints.Handset]).subscribe(r => this.isHandset.set(!!r.matches));
  }

  /** Texto por defecto para estado vacío (si no se provee emptyTemplate). */
  @Input() emptyText = 'Sin resultados';

  /** Template opcional para estado vacío. */
  @Input() emptyTemplate?: TemplateRef<unknown>;

  valueOf(row: T, key: string): unknown {
    return (row as unknown as Record<string, unknown>)[key];
  }

  get displayedColumnKeys(): string[] {
    const cols = this.columns ?? [];
    if (this.isHandset()) {
      return cols.filter(c => !c.hideOnHandset).map(c => c.key);
    }
    return cols.map(c => c.key);
  }
}






