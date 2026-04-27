import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FileType } from '../../../models/report';

@Component({
  selector: 'app-export-bar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="bar">
      <button mat-stroked-button type="button" (click)="export.emit(FileType.CSV)" [disabled]="loading">
        <mat-icon>table_view</mat-icon>
        CSV
      </button>
      <button mat-stroked-button type="button" (click)="export.emit(FileType.EXCEL)" [disabled]="loading">
        <mat-icon>grid_on</mat-icon>
        Excel
      </button>
      <button mat-stroked-button type="button" (click)="export.emit(FileType.PDF)" [disabled]="loading">
        <mat-icon>picture_as_pdf</mat-icon>
        PDF
      </button>
    </div>
  `,
  styles: [
    `
      .bar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
      button mat-icon { margin-right: 6px; }
    `,
  ],
})
export class ExportBarComponent {
  @Input() loading = false;
  @Output() export = new EventEmitter<FileType>();

  protected FileType = FileType;
}

