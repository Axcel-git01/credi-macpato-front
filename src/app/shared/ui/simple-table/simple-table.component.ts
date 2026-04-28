import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

export interface SimpleColumn {
  key: string;
  header: string;
}

@Component({
  selector: 'app-simple-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  template: `
    @if (columns.length) {
      <table mat-table [dataSource]="rows" class="mat-elevation-z1" style="width:100%">
        @for (col of columns; track col.key) {
          <ng-container [matColumnDef]="col.key">
            <th mat-header-cell *matHeaderCellDef>{{ col.header }}</th>
            <td mat-cell *matCellDef="let row">{{ valueOf(row, col.key) }}</td>
          </ng-container>
        }

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns" [attr.data-id]="valueOf(row, columns.length ? columns[0].key : '')"></tr>

        @if (!rows || !rows.length) {
          <tr class="mat-row">
            <td class="mat-cell" [attr.colspan]="displayedColumns.length" style="padding:16px; text-align:center;">No hay resultados.</td>
          </tr>
        }
      </table>
    } @else {
      <div>No columns defined.</div>
    }
  `,
})
export class SimpleMatTableComponent implements OnChanges {
  @Input() rows: readonly unknown[] = [];
  @Input() columns: SimpleColumn[] = [];

  displayedColumns: string[] = [];

  ngOnChanges(_changes: SimpleChanges): void {
    this.displayedColumns = (this.columns ?? []).map((c) => c.key);
  }

  valueOf(row: unknown, key: string): unknown {
    if (!key) return '';
    const parts = key.split('.');
    let cur: any = row as any;
    for (const p of parts) {
      if (cur == null) return '';
      cur = cur[p];
    }
    return cur ?? '';
  }
}

