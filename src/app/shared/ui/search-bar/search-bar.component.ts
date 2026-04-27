import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './search-bar.component.html',
  styles: ['.search { width: 100%; max-width: 420px; }'],
})
export class SearchBarComponent {
  @Input() label = 'Buscar';
  @Input() placeholder = 'Escribe para buscar...';
  @Input() hint?: string;

  /** 'auto': solo cuando hay texto. 'always': siempre visible. 'never': oculto. */
  @Input() clearMode: 'auto' | 'always' | 'never' = 'auto';

  @Output() valueChange = new EventEmitter<string>();

  control = new FormControl<string>('', { nonNullable: true });

  emit(): void {
    this.valueChange.emit(this.control.value);
  }

  clear(): void {
    this.control.setValue('');
    this.valueChange.emit('');
  }

  /** Permite setear el valor desde fuera (por ejemplo al sincronizar con queryParams). */
  setValue(value: string): void {
    this.control.setValue(value);
    this.valueChange.emit(value);
  }

}







