import {Component, computed, inject, signal, ViewChild, AfterViewInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSidenav } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

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
      <mat-sidenav #drawer (openedChange)="onSidenavOpenedChange($event)" [mode]="isHandset() ? 'over' : 'side'" [opened]="opened()" class="shell__sidenav">
        <mat-nav-list>
          @for (item of menu(); track item.link) {
            <a mat-list-item [routerLink]="item.link">
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
            </a>
          }
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
          <ng-content />
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
export class AppShellComponent implements AfterViewInit {
  protected auth = inject(AuthService);
  private router = inject(Router);
  private bp = inject(BreakpointObserver);
  protected opened = signal(true);
  protected isHandset = signal(false);
  @ViewChild('drawer') drawer?: MatSidenav;

  async toggle(): Promise<void> {
    if (this.drawer) {
      await this.drawer.toggle();
      this.opened.set(this.drawer.opened);
      return;
    }
    this.opened.update(v => !v);
  }

  onSidenavOpenedChange(opened: boolean): void {
    this.opened.set(opened);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }



  menu = computed(() => {
    if (this.auth.isAssociation()) {
      return [
        { label: 'Inicio', icon: 'home', link: '/home' },
        { label: 'Ventas', icon: 'point_of_sale', link: '/sales' },
        { label: 'Puestos', icon: 'storefront', link: '/stands' },
        { label: 'Miembros', icon: 'groups', link: `/association/${this.auth.getCurrentUser()?.id}/members` },
        { label: 'Reportes', icon: 'reports', link: '/reports' },
        { label: 'Mi Asociación', icon: 'apartment', link: '/my-association' },
      ];
    }

    if (this.auth.isVendor()) {
      return [
        { label: 'Inicio', icon: 'home', link: '/home' },
        { label: 'Ventas', icon: 'point_of_sale', link: '/sales' },
        { label: 'Puestos', icon: 'storefront', link: '/stands' },
        { label: 'Reportes', icon: 'reports', link: '/reports' },
        { label: 'Mi perfil', icon: 'person', link: '/profile' },
      ];
    }

    if (this.auth.isCustomer()) {
      return [
        { label: 'Inicio', icon: 'home', link: '/home' },
        { label: 'Compras', icon: 'shopping_bag', link: '/purchases' },
        { label: 'Deudas', icon: 'account_balance_wallet', link: '/debts' },
        { label: 'Reportes', icon: 'reports', link: '/reports' },
        { label: 'Mi perfil', icon: 'person', link: '/profile' },
      ];
    }

    return [{ label: 'Inicio', icon: 'home', link: '/home' }];
  });

  ngAfterViewInit(): void {
    this.bp.observe([Breakpoints.Handset]).subscribe(result => {
      const handset = result.matches;
      this.isHandset.set(handset);
      if (this.drawer) {
        if (handset) {
          this.drawer.close();
        } else {
          this.drawer.open();
        }
        this.opened.set(this.drawer.opened);
      } else {
        this.opened.set(!handset);
      }
    });
  }
}


