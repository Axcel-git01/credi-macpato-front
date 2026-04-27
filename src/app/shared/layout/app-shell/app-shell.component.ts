import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
  ],
  template: `
    <mat-sidenav-container class="shell">
      <mat-sidenav #drawer mode="side" [opened]="opened()" class="shell__sidenav">
        <mat-nav-list>
          <!-- Placeholders temporales; luego se reemplaza por menú real por rol -->
          <a mat-list-item routerLink="/login">Login</a>
          <a mat-list-item routerLink="/register">Registro</a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="shell__content">
        <mat-toolbar color="primary">
          <button mat-icon-button (click)="toggle()" aria-label="Toggle sidenav">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="shell__title">CrediMacpato</span>
          <span class="shell__spacer"></span>
          @if (auth.isLoggedIn()) {
            <button mat-button (click)="logout()">Cerrar sesión</button>
          }
        </mat-toolbar>

        <div class="shell__router">
          <router-outlet />
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .shell { height: 100vh; }
      .shell__sidenav { width: 260px; }
      .shell__content { display: flex; flex-direction: column; height: 100%; }
      .shell__title { margin-left: 8px; font-weight: 600; }
      .shell__spacer { flex: 1 1 auto; }
      .shell__router { padding: 16px; flex: 1 1 auto; overflow: auto; }
    `,
  ],
})
export class AppShellComponent {
  protected auth = inject(AuthService);
  protected opened = signal(true);

  toggle(): void {
    this.opened.update(v => !v);
  }

  logout(): void {
    this.auth.logout();
  }
}


