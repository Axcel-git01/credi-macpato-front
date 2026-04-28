import {Component, computed, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { StandService } from '../../services/stand.service';
import {StandRequestDTO, StandResponseDTO} from '../../models/stand';
import { ErrorResponse } from '../../models/error.response';

import { AppShellComponent } from '../../shared/layout/app-shell/app-shell.component';
import { SearchBarComponent } from '../../shared/ui/search-bar/search-bar.component';
import { CardComponent } from '../../shared/cards/card.component';
import { ToastService } from '../../shared/ui/toast/toast.service';
import {AuthService} from '../../services/auth.service';
import {StandFormComponent} from './stand-form.component';


@Component({
  selector: 'app-stands-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AppShellComponent,
    SearchBarComponent,
    CardComponent,
    StandFormComponent,
  ],
  template: `
    <app-shell>
      <mat-card appearance="outlined">
        <mat-card-content>
          <div style="display:flex; gap:12px; align-items:center; justify-content:space-between; flex-wrap:wrap;">
            <h2 style="margin:0;">Puestos</h2>
            <app-search-bar
              label="Buscar"
              placeholder="Número, descripción o dueño..."
              clearMode="auto"
              (valueChange)="query.set($event)" />
            <button mat-stroked-button color="primary" (click)="openForm()">
              <mat-icon>add</mat-icon>
              Nuevo Puesto
            </button>
          </div>

          @if (showForm()) {
            <mat-card appearance="outlined" style="margin-top:16px;">
              <mat-card-content>
                <app-stand-form
                  [ownerId]="owner()?.id ? String(owner()!.id) : null"
                  (save)="onCreate($event)"
                  (cancel)="closeForm()" />
              </mat-card-content>
            </mat-card>
          }

          <div style="margin-top:16px;">
            @if (loading()) {
              <div style="display:flex; align-items:center; gap:12px; padding:12px 0;">
                <mat-progress-spinner diameter="20" mode="indeterminate" />
                <span>Cargando puestos...</span>
              </div>
            } @else {
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:16px;">
                @for (stand of stands(); track stand.id) {
                  <app-card [title]="'Puesto ' + stand.number" subtitle="" icon="store">
                    <div>
                      <p style="margin:0 0 8px 0;">{{ stand.description }}</p>
                    </div>
                    <div card-actions>
                      <a mat-icon-button [routerLink]="['/stands', stand.id]">
                        <mat-icon>open_in_new</mat-icon>
                      </a>
                      <a mat-icon-button [routerLink]="['/vouchers/stand', stand.id]">
                        <mat-icon>receipt_long</mat-icon>
                      </a>
                      <a mat-icon-button [routerLink]="['/payments/stand', stand.id, 'range']">
                        <mat-icon>payments</mat-icon>
                      </a>
                    </div>
                  </app-card>
                } @empty {
                  <div>No hay puestos para mostrar.</div>
                }
              </div>
            }
          </div>

        </mat-card-content>
      </mat-card>
    </app-shell>
  `,
})
export class StandsPage {
  private standService = inject(StandService);
  private toast        = inject(ToastService);
  private auth = inject(AuthService);

  loading  = signal(false);
  query    = signal('');
  showForm = signal(false);
  owner    = computed(() => this.auth.getCurrentUser());
  stands   = signal<StandResponseDTO[]>([]);

  String = String;

  constructor() {
    this.load();
  }

  openForm(): void  { this.showForm.set(true);  }
  closeForm(): void { this.showForm.set(false); }

  onCreate(dto: StandRequestDTO): void {
    this.standService.create(dto).subscribe({
      next: (created) => {
        this.stands.update(list => [...list, created]);
        this.toast.success('Puesto creado correctamente.');
        this.closeForm();
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ErrorResponse | undefined;
        this.toast.error(apiError?.message ?? 'No se pudo crear el puesto.');
      },
    });
  }

  load(): void {
    const user = this.owner();
    if (!user) return;

    this.loading.set(true);
    this.standService.listByOwner(user.id).subscribe({
      next:  (rows) => { this.stands.set(rows ?? []); this.loading.set(false); },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        const apiError = err.error as ErrorResponse | undefined;
        this.toast.error(apiError?.message ?? 'No se pudieron cargar los puestos.');
      },
    });
  }
}
