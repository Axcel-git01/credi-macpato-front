import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { DateFieldComponent } from '../fields/date-field/date-field.component';

export type DateRangeGroup = FormGroup<{ from: FormControl<Date | null>; to: FormControl<Date | null> }>;

@Component({
  selector: 'app-date-range',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DateFieldComponent],
  template: `
    <div class="range" [formGroup]="group">
      <app-date-field [control]="group.controls.from" [label]="fromLabel" />
      <app-date-field [control]="group.controls.to" [label]="toLabel" />
    </div>
  `,
  styles: [
    `
      .range { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      @media (max-width: 720px) { .range { grid-template-columns: 1fr; } }
    `,
  ],
})
export class DateRangeComponent {
  @Input({ required: true }) group!: DateRangeGroup;
  @Input() fromLabel = 'Desde';
  @Input() toLabel = 'Hasta';
}

