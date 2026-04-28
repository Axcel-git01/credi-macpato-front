import {Component, computed, inject, signal} from '@angular/core';
import { AppShellComponent } from '../../shared/layout/app-shell/app-shell.component';
import {MatIcon} from '@angular/material/icon';
import {MatCard, MatCardAvatar, MatCardContent, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {ErrorResponse} from '../../models/error.response';
import {ToastService} from '../../shared/ui/toast/toast.service';
import {
  AssociationResponseDTO,
  CustomerResponseDTO,
  VendorResponseDTO
} from '../../models/user.response';
import {Role, UserRequest, UserType} from '../../models/user.request';
import {UserFormComponent} from './user-form/user.form';
import {Route, Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [AppShellComponent, MatIcon, MatCard, MatCardTitle, MatCardSubtitle, MatCardAvatar, MatButton, MatTabGroup, MatTab, MatCardContent, UserFormComponent],
  template: `
    <app-shell>
      <div class="profile-container">
        @if (!editMode()) {
          <mat-card class="profile-card">
            <img mat-card-avatar src="assets/avatar.png" alt="avatar"/>
            <mat-card-title>{{ user()?.fullName }}</mat-card-title>
            <mat-card-subtitle>{{ user()?.username }}</mat-card-subtitle>

            <div class="actions">
              <button mat-raised-button color="primary" (click)="updateAccount()">Editar Perfil</button>
              <button mat-raised-button color="warn" (click)="deactivateAccount()">Desactivar Cuenta</button>
            </div>
          </mat-card>
        } @else {
          <app-user-form
            [initial]="user()"
            (save)="onSaveUser($event)"
            (cancel)="onCancelEdit()">
          </app-user-form>
        }

        <mat-tab-group>
          <mat-tab label="Información Personal">
            <div class="info-grid">
              <div>
                <p><strong>Se unió:</strong> {{ user()?.createdAt }}</p>
              </div>
              <div>
                <p><strong>Miembro de:</strong> {{ association()?.registrationName }}</p>
                <p><strong>Estado:</strong> {{ state() }}</p>
              </div>
              @if (this.auth.isCustomer()) {

              }

            </div>
          </mat-tab>

          <mat-tab label="Dirección">
            <p>Próximamente: gestión de direcciones.</p>
          </mat-tab>

          <mat-tab label="Mi Actividad">
            <mat-card class="activity-card">
              <mat-card-content>
                <p>
                  <mat-icon>shopping_bag</mat-icon>
                  125 Pedidos Realizados
                </p>
                <p>
                  <mat-icon>storefront</mat-icon>
                  58 Ventas Realizadas
                </p>
              </mat-card-content>
            </mat-card>
          </mat-tab>
        </mat-tab-group>
      </div>
    </app-shell>
  `, styles: [`
    .profile-container {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .profile-card {
      text-align: center;
      max-width: 400px;
      margin: auto;
    }

    .actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 1rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      padding: 1rem;
    }

    .activity-card {
      margin: 1rem auto;
      max-width: 400px;
      text-align: center;
    }
    @media (max-width: 768px) {
      .info-grid {
        grid-template-columns: 1fr;
      }
    }`]
})
export class ProfilePage {
  constructor() {
    this.getCurrentAssociation();
  }

  protected auth:AuthService = inject(AuthService);
  private userService: UserService = inject(UserService);
  private toast: ToastService = inject(ToastService);

  association = signal<AssociationResponseDTO | null>(null);
  user = signal(this.auth.getCurrentUser());
  state = computed(() => (this.user()?.state? 'Activo' : 'Deshabilitado'));

  deactivateAccount() {
    this.userService.disable(this.user()?.id!).subscribe({
      next: user => {
        this.user.set(user);
        this.toast.info("Cuenta Desactivada. Cerrando Sesión...");
        this.auth.logout();
      },
      error: (err: ErrorResponse) => {
        this.toast.error(err.message);
      }
    });
  }

  getCurrentAssociation() {
    const user = this.user();
    let id = null;
    if (this.auth.isVendor()) {
      id = (user as VendorResponseDTO).associationId;
    } else if (this.auth.isCustomer()) {
      id = (user as CustomerResponseDTO).associationId;
    } else return;
    console.log(id);
    console.table(user);
    this.userService.findById(id).subscribe({
      next: (u) => {
        this.association.set(u as AssociationResponseDTO);
      },
      error: (err: ErrorResponse) =>  {
        console.error(err.message);
      }
    });
  }

  editMode = signal(false);

  updateAccount() {
    this.editMode.set(true);
  }

  onSaveUser(payload: UserRequest) {
    this.userService.update(this.user()?.id!, payload).subscribe({
      next: updated => {
        this.user.set(updated);
        this.toast.success('Perfil actualizado correctamente');
        this.editMode.set(false);
      },
      error: (err: ErrorResponse) => {
        this.toast.error(err.message);
      }
    });
  }


  onCancelEdit() {
    this.editMode.set(false);
  }
}
