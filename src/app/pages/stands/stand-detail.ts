import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

import { AppShellComponent } from '../../shared/layout/app-shell/app-shell.component';
import { ToastService } from '../../shared/ui/toast/toast.service';

import { StandService } from '../../services/stand.service';
import { UserService } from '../../services/user.service';
import { StandResponseDTO } from '../../models/stand';
import { UserResponse } from '../../models/user.response';
import { ErrorResponse } from '../../models/error.response';

@Component({
  selector: 'app-stand-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    AppShellComponent,
  ],
  template: `
    <app-shell>
      <div style="display:flex; gap:8px; align-items:center; margin-bottom:12px; flex-wrap: wrap;">
        <a mat-button routerLink="/stands">
          <mat-icon>arrow_back</mat-icon>
          Volver
        </a>
      </div>

      <mat-card appearance="outlined">
        <mat-card-content>
          @if (loading()) {
            <div style="display:flex; align-items:center; gap:12px; padding: 12px 0;">
              <mat-progress-spinner diameter="20" mode="indeterminate" />
              <span>Cargando puesto...</span>
            </div>
          } @else {
            @if (stand()) {
              <div style="display:flex; justify-content: space-between; gap: 12px; align-items: start; flex-wrap: wrap;">
                <div>
                  <h2 style="margin:0;">Puesto {{ stand()!.number }}</h2>
                  <div style="opacity:.85; margin-top:6px;">{{ stand()!.description }}</div>
                  <div style="opacity:.85; margin-top:6px;">Dueño: {{ ownerLabel() }}</div>
                </div>

                <div style="display:flex; gap:8px; flex-wrap: wrap; justify-content: flex-end;">
                  <a mat-stroked-button color="primary" [routerLink]="['/vouchers/stand', stand()!.id]">
                    <mat-icon>receipt_long</mat-icon>
                    Vouchers
                  </a>
                  <a mat-stroked-button color="primary" [routerLink]="['/vouchers/stand', stand()!.id, 'range']">
                    <mat-icon>date_range</mat-icon>
                    Vouchers por rango
                  </a>
                  <a mat-stroked-button color="primary" [routerLink]="['/payments/stand', stand()!.id, 'range']">
                    <mat-icon>payments</mat-icon>
                    Pagos
                  </a>
                </div>
              </div>

              <mat-divider style="margin: 16px 0;"></mat-divider>

              <!-- Contenido en blanco por ahora -->
              <div>
                <!-- Aquí luego: KPIs, últimas ventas/pagos, acciones de edición/cambio de dueño, etc. -->
              </div>
            } @else {
              <div style="padding: 12px 0; opacity: .85;">No se encontró el puesto.</div>
            }
          }
        </mat-card-content>
      </mat-card>
    </app-shell>
  `,
})
export class StandDetailPage {
  private route = inject(ActivatedRoute);
  private standService = inject(StandService);
  private userService = inject(UserService);
  private toast = inject(ToastService);

  loading = signal(false);
  stand = signal<StandResponseDTO | null>(null);
  owner = signal<UserResponse | null>(null);

  ownerLabel = computed(() => {
    const o = this.owner();
    const s = this.stand();
    if (!s) return '';
    if (!o) return `#${String(s.ownerId)}`;
    const any = o as unknown as { fullName?: string; username?: string };
    return any.fullName || any.username || `#${String(s.ownerId)}`;
  });

  constructor() {
    this.load();
  }

  private load(): void {
    const idRaw = this.route.snapshot.paramMap.get('id');
    if (!idRaw) {
      this.toast.error('Falta el parámetro id del puesto.');
      return;
    }

    let id: bigint;
    try {
      id = BigInt(idRaw);
    } catch {
      this.toast.error('El id del puesto no es válido.');
      return;
    }

    this.loading.set(true);
    this.standService.findById(id).subscribe({
      next: (s) => {
        this.stand.set(s);
        this.loading.set(false);
        this.loadOwner(s.ownerId);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        const apiError = err.error as ErrorResponse | undefined;
        this.toast.error(apiError?.message ?? 'No se pudo cargar el puesto.');
      },
    });
  }

  private loadOwner(ownerId: bigint): void {
    try {
      this.userService.findById(ownerId).subscribe({
        next: (u) => this.owner.set(u),
        error: (err: ErrorResponse) => {
          console.error(err.message);
        },
      });
    } catch {
    }
  }
}

