import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AssociationService } from '../../services/association.service';
import { UserResponse } from '../../models/user.response';
import { AppShellComponent } from '../../shared/layout/app-shell/app-shell.component';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { ErrorResponse } from '../../models/error.response';
import { AuthService } from '../../services/auth.service';
import {MatTableModule} from '@angular/material/table';
import { SimpleMatTableComponent, SimpleColumn } from '../../shared/ui/simple-table/simple-table.component';

type ViewMode = 'ALL' | 'CUSTOMERS' | 'VENDORS';

@Component({
  selector: 'app-association-members-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatSelectModule, MatTableModule, MatProgressSpinnerModule, AppShellComponent, SimpleMatTableComponent],
  template: `
    <app-shell>
      <mat-card appearance="outlined">
        <mat-card-content>
          <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
            <h2 style="margin:0">Miembros</h2>
            <div style="display:flex; gap:8px; align-items:center;">
                  <mat-select [value]="mode()" (selectionChange)="onModeChange($event.value)">
                    <mat-option value="ALL">Ver Todos</mat-option>
                    <mat-option value="CUSTOMERS">Ver Clientes</mat-option>
                    <mat-option value="VENDORS">Ver Comerciantes</mat-option>
                  </mat-select>
            </div>
          </div>

          <div style="margin-top:16px;">
            @if (loading()) {
              <div style="display:flex; align-items:center; gap:12px; padding:12px 0;">
                <mat-progress-spinner diameter="20" mode="indeterminate"></mat-progress-spinner>
                <span>Cargando...</span></div>
            } @else {
              <app-simple-table [rows]="list()" [columns]="tableCols"/>
            }
          </div>
        </mat-card-content>
      </mat-card>
    </app-shell>
  `,
})
export class AssociationMembersPage {
  private associationService = inject(AssociationService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);

  loading = signal(false);
  mode = signal<ViewMode>('ALL');
  list = signal<UserResponse[]>([]);

  tableCols: SimpleColumn[] = [
    { key: 'username', header: 'Nombre de Usuario' },
    {key: 'fullName', header: 'Nombre Completo'},
    { key: 'role.displayName', header: 'Rol' },
  ];

  constructor() {
    this.loadForMode(this.mode());
  }

  onModeChange(val: ViewMode) {
    this.mode.set(val);
    this.loadForMode(val);
  }

  private loadForMode(mode: ViewMode) {
    this.loading.set(true);
    const currentUser = this.auth.getCurrentUser();
    const assocId = currentUser?.id;
    if (mode === 'ALL') {
      if (!assocId) {
        this.list.set([]);
        return;
      }

      this.associationService.listMembers(BigInt(assocId)).subscribe({
        next: (rows) => {
          this.list.set(rows ?? []);
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          const apiError = (err?.error ?? null) as ErrorResponse | null;
          this.toast.error(apiError?.message ?? 'No se pudieron cargar miembros.');
        }
      });
      return;
    }

    if (mode === 'CUSTOMERS') {
      if (!assocId) {
        this.list.set([]);
        this.loading.set(false);
        this.toast.error('No hay asociación seleccionada.');
        return;
      }
      this.associationService.listCustomers(BigInt(assocId)).subscribe({
        next: (rows) => {
          this.list.set(rows ?? []);
          this.loading.set(false);
        }, error: (err) => {
          this.loading.set(false);
          const apiError = (err?.error ?? null) as ErrorResponse | null;
          this.toast.error(apiError?.message ?? 'No se pudieron cargar clientes.');
        }
      });
    } else if (mode === 'VENDORS') {
      if (!assocId) {
        this.list.set([]);
        this.loading.set(false);
        this.toast.error('No hay asociación seleccionada.');
        return;
      }
      this.associationService.listVendors(BigInt(assocId)).subscribe({
        next: (rows) => {
          this.list.set(rows ?? []);
          this.loading.set(false);
        }, error: (err) => {
          this.loading.set(false);
          const apiError = (err?.error ?? null) as ErrorResponse | null;
          this.toast.error(apiError?.message ?? 'No se pudieron cargar vendedores.');
        }
      });
    }
  }
}













