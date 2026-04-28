import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Páginas placeholder para navegar por la app mientras se implementa cada feature.
 * Todas son standalone y usan Angular Material.
 */

@Component({
  selector: 'app-page-placeholder',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="wrap">
      <mat-card appearance="outlined" class="card">
        <mat-card-content>
          <div class="title">
            <mat-icon>construction</mat-icon>
            <h2>{{ title }}</h2>
          </div>
          <p class="subtitle">{{ subtitle }}</p>
          @if (details?.length) {
            <ul>
              @for (d of details; track d) {
                <li>{{ d }}</li>
              }
            </ul>
          }
          <div class="actions">
            <a mat-stroked-button color="primary" routerLink="/">Volver a inicio</a>
            <a mat-button routerLink="/login">Ir a login</a>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .wrap { max-width: 980px; margin: 0 auto; padding: 24px 16px; }
      .card { border-radius: 16px; }
      .title { display: flex; align-items: center; gap: 10px; }
      h2 { margin: 0; }
      .subtitle { opacity: .8; margin-top: 8px; }
      ul { margin: 12px 0 0; padding-left: 18px; opacity: .9; }
      .actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }
    `,
  ],
})
export class PagePlaceholderComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle = 'Página en construcción.';
  @Input() details: string[] | null = null;
}

@Component({
  selector: 'app-association-vendors-page',
  standalone: true,
  imports: [PagePlaceholderComponent],
  template: `<app-page-placeholder
    title="Asociación · Vendedores"
    subtitle="Listado y administración de vendedores por asociación"
    [details]="[
      'Tabla de vendedores (DataTable) con búsqueda y acciones',
      'Crear/editar/activar/bloquear',
      'Filtros por estado y tipo'
    ]" />`,
})
export class AssociationVendorsPage {}

@Component({
  selector: 'app-association-customers-page',
  standalone: true,
  imports: [PagePlaceholderComponent],
  template: `<app-page-placeholder
    title="Asociación · Clientes"
    subtitle="Listado y administración de clientes por asociación"
    [details]="['Tabla de clientes', 'Acciones de estado', 'Exportación']" />`,
})
export class AssociationCustomersPage {}

@Component({
  selector: 'app-association-members-page',
  standalone: true,
  imports: [PagePlaceholderComponent],
  template: `<app-page-placeholder
    title="Asociación · Miembros"
    subtitle="Listado unificado de miembros (clientes + vendedores)"
    [details]="['Tabla unificada + filtros por rol', 'Acciones de bloqueo/activación']" />`,
})
export class AssociationMembersPage {}

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [PagePlaceholderComponent],
  template: `<app-page-placeholder
    title="Usuarios"
    subtitle="Administración de usuarios (asociación)"
    [details]="['Listar', 'Crear', 'Editar', 'Bloquear/Activar/Desactivar', 'Eliminar']" />`,
})
export class UsersPage {}

@Component({
  selector: 'app-user-detail-page',
  standalone: true,
  imports: [PagePlaceholderComponent],
  template: `<app-page-placeholder
    title="Usuario · Detalle"
    subtitle="Vista de detalle del usuario"
    [details]="['Datos generales', 'Estado', 'Acciones administrativas']" />`,
})
export class UserDetailPage {}


@Component({
  selector: 'app-stands-by-owner-page',
  standalone: true,
  imports: [PagePlaceholderComponent],
  template: `<app-page-placeholder
    title="Mis stands"
    subtitle="Stands por propietario (vendor)"
    [details]="['Listado de stands del vendor', 'Acceso rápido a vouchers/pagos']" />`,
})
export class StandsByOwnerPage {}

@Component({
  selector: 'app-voucher-detail-page',
  standalone: true,
  imports: [PagePlaceholderComponent],
  template: `<app-page-placeholder
    title="Voucher · Detalle"
    subtitle="Detalle de voucher"
    [details]="['Información', 'Items', 'Estado', 'Acciones (pagar/anular)']" />`,
})
export class VoucherDetailPage {}

@Component({
  selector: 'app-vouchers-by-stand-page',
  standalone: true,
  imports: [PagePlaceholderComponent],
  template: `<app-page-placeholder
    title="Vouchers por stand"
    subtitle="Listado de vouchers de un stand"
    [details]="['Tabla', 'Filtros', 'Exportación']" />`,
})
export class VouchersByStandPage {}

@Component({
  selector: 'app-vouchers-by-customer-page',
  standalone: true,
  imports: [PagePlaceholderComponent],
  template: `<app-page-placeholder
    title="Vouchers por cliente"
    subtitle="Listado de vouchers de un cliente"
    [details]="['Tabla', 'Filtros por estado', 'Acciones']" />`,
})
export class VouchersByCustomerPage {}

@Component({
  selector: 'app-vouchers-pending-by-customer-page',
  standalone: true,
  imports: [PagePlaceholderComponent],
  template: `<app-page-placeholder
    title="Vouchers pendientes"
    subtitle="Vouchers pendientes del cliente"
    [details]="['Tabla de pendientes', 'Acción: pagar']" />`,
})
export class VouchersPendingByCustomerPage {}

@Component({
  selector: 'app-vouchers-pending-by-issuer-page',
  standalone: true,
  imports: [PagePlaceholderComponent],
  template: `<app-page-placeholder
    title="Vouchers pendientes (emisor)"
    subtitle="Pendientes por issuer/vendor"
    [details]="['Tabla', 'Acciones operativas']" />`,
})
export class VouchersPendingByIssuerPage {}

@Component({
  selector: 'app-vouchers-range-by-stand-page',
  standalone: true,
  imports: [PagePlaceholderComponent],
  template: `<app-page-placeholder
    title="Vouchers por rango"
    subtitle="Consulta por rango de fechas (stand)"
    [details]="['Selector de rango (DateRange)', 'Exportación']" />`,
})
export class VouchersRangeByStandPage {}

@Component({
  selector: 'app-voucher-unit-types-page',
  standalone: true,
  imports: [PagePlaceholderComponent],
  template: `<app-page-placeholder
    title="Tipos de unidad"
    subtitle="Catálogo relacionado a vouchers"
    [details]="['Listado', 'Crear/editar']" />`,
})
export class VoucherUnitTypesPage {}

@Component({
  selector: 'app-payment-detail-page',
  standalone: true,
  imports: [PagePlaceholderComponent],
  template: `<app-page-placeholder
    title="Pago · Detalle"
    subtitle="Detalle de pago"
    [details]="['Información', 'Voucher asociado', 'Comprobante']" />`,
})
export class PaymentDetailPage {}

@Component({
  selector: 'app-payments-by-customer-page',
  standalone: true,
  imports: [PagePlaceholderComponent],
  template: `<app-page-placeholder
    title="Pagos por cliente"
    subtitle="Historial de pagos del cliente"
    [details]="['Tabla', 'Filtros', 'Exportación']" />`,
})
export class PaymentsByCustomerPage {}

@Component({
  selector: 'app-payments-by-voucher-page',
  standalone: true,
  imports: [PagePlaceholderComponent],
  template: `<app-page-placeholder
    title="Pagos por voucher"
    subtitle="Pagos asociados a un voucher"
    [details]="['Listado', 'Detalle']" />`,
})
export class PaymentsByVoucherPage {}

@Component({
  selector: 'app-payments-range-by-stand-page',
  standalone: true,
  imports: [PagePlaceholderComponent],
  template: `<app-page-placeholder
    title="Pagos por rango"
    subtitle="Consulta por rango de fechas (stand)"
    [details]="['Selector de rango', 'Exportación']" />`,
})
export class PaymentsRangeByStandPage {}

@Component({
  selector: 'app-charge-reasons-page',
  standalone: true,
  imports: [PagePlaceholderComponent],
  template: `<app-page-placeholder
    title="Motivos de cobro"
    subtitle="Catálogo de motivos de cobro"
    [details]="['Listado', 'Crear/editar', 'Asignar a stand']" />`,
})
export class ChargeReasonsPage {}

@Component({
  selector: 'app-charge-reason-detail-page',
  standalone: true,
  imports: [PagePlaceholderComponent],
  template: `<app-page-placeholder
    title="Motivo de cobro · Detalle"
    subtitle="Detalle del motivo de cobro"
    [details]="['Información', 'Acciones']" />`,
})
export class ChargeReasonDetailPage {}

@Component({
  selector: 'app-charge-reasons-by-stand-page',
  standalone: true,
  imports: [PagePlaceholderComponent],
  template: `<app-page-placeholder
    title="Motivos de cobro por stand"
    subtitle="Motivos configurados por stand"
    [details]="['Listado', 'Asignación']" />`,
})
export class ChargeReasonsByStandPage {}

@Component({
  selector: 'app-debts-import-page',
  standalone: true,
  imports: [PagePlaceholderComponent],
  template: `<app-page-placeholder
    title="Deudas · Importación"
    subtitle="Carga masiva de deudas (CSV/Excel)"
    [details]="['Upload', 'Preview en tabla', 'Validaciones', 'Confirmación']" />`,
})
export class DebtsImportPage {}

@Component({
  selector: 'app-report-cash-closure-page',
  standalone: true,
  imports: [PagePlaceholderComponent],
  template: `<app-page-placeholder
    title="Reporte · Cierre de caja"
    subtitle="Cierre por rango/stand"
    [details]="['Filtros', 'KPIs', 'Exportación']" />`,
})
export class ReportCashClosurePage {}

@Component({
  selector: 'app-report-customer-debts-page',
  standalone: true,
  imports: [PagePlaceholderComponent],
  template: `<app-page-placeholder
    title="Reporte · Deudas de clientes"
    subtitle="Reporte de deudas y pagos por cliente"
    [details]="['Filtros', 'Tabla', 'Exportación']" />`,
})
export class ReportCustomerDebtsPage {}

@Component({
  selector: 'app-report-cash-closure-export-page',
  standalone: true,
  imports: [PagePlaceholderComponent],
  template: `<app-page-placeholder
    title="Exportación · Cierre de caja"
    subtitle="Generación de archivo de exportación"
    [details]="['Descarga via DownloadService', 'Parámetros de export']" />`,
})
export class ReportCashClosureExportPage {}

@Component({
  selector: 'app-report-customer-debts-export-page',
  standalone: true,
  imports: [PagePlaceholderComponent],
  template: `<app-page-placeholder
    title="Exportación · Deudas de clientes"
    subtitle="Generación de archivo de exportación"
    [details]="['Descarga', 'Parámetros']" />`,
})
export class ReportCustomerDebtsExportPage {}

