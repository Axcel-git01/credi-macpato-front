import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div
      class="drop"
      [class.drop--disabled]="disabled"
      (dragover)="onDragOver($event)"
      (drop)="onDrop($event)">
      <mat-icon class="drop__icon">upload_file</mat-icon>
      <div class="drop__text">
        <div class="drop__title">{{ title }}</div>
        <div class="drop__subtitle">{{ subtitle }}</div>
      </div>

      <input
        #fileInput
        type="file"
        class="drop__input"
        [accept]="accept"
        [disabled]="disabled"
        (change)="onFileSelected($event)" />

      <button mat-stroked-button type="button" (click)="fileInput.click()" [disabled]="disabled">
        Seleccionar archivo
      </button>
    </div>

    @if (fileName) {
      <div class="file">
        <mat-icon>description</mat-icon>
        <span>{{ fileName }}</span>
        <button mat-button type="button" (click)="clear()" [disabled]="disabled">Quitar</button>
      </div>
    }
  `,
  styles: [
    `
      .drop {
        border: 1px dashed rgba(0,0,0,0.3);
        border-radius: 12px;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .drop--disabled { opacity: 0.7; pointer-events: none; }
      .drop__icon { color: rgba(0,0,0,0.55); }
      .drop__text { flex: 1 1 auto; }
      .drop__title { font-weight: 600; }
      .drop__subtitle { color: rgba(0,0,0,0.6); font-size: 12px; }
      .drop__input { display: none; }
      .file { margin-top: 10px; display: flex; gap: 8px; align-items: center; }
    `,
  ],
})
export class FileUploadComponent {
  @Input() accept = '*/*';
  @Input() disabled = false;
  @Input() title = 'Arrastra y suelta tu archivo';
  @Input() subtitle = 'o selecciona desde tu equipo';

  @Input() fileName: string | null = null;

  @Output() fileChange = new EventEmitter<File | null>();

  onDragOver(evt: DragEvent): void {
    evt.preventDefault();
  }

  onDrop(evt: DragEvent): void {
    evt.preventDefault();
    if (this.disabled) return;

    const file = evt.dataTransfer?.files?.item(0) ?? null;
    this.fileName = file?.name ?? null;
    this.fileChange.emit(file);
  }

  onFileSelected(evt: Event): void {
    if (this.disabled) return;
    const input = evt.target as HTMLInputElement;
    const file = input.files?.item(0) ?? null;
    this.fileName = file?.name ?? null;
    this.fileChange.emit(file);
  }

  clear(): void {
    this.fileName = null;
    this.fileChange.emit(null);
  }
}


