import {Component, inject, signal, computed, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule }           from '@angular/material/card';
import { MatButtonModule }         from '@angular/material/button';
import { MatIconModule }           from '@angular/material/icon';
import { MatFormFieldModule }      from '@angular/material/form-field';
import { MatInputModule }          from '@angular/material/input';
import { MatSelectModule }         from '@angular/material/select';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatDividerModule }        from '@angular/material/divider';
import { MatChipsModule }          from '@angular/material/chips';
import { MatTooltipModule }        from '@angular/material/tooltip';

import { AppShellComponent }       from '../../shared/layout/app-shell/app-shell.component';
import { PageHeaderComponent } from '../../shared/layout/page-header/page-header.component';
import { CardComponent }           from '../../shared/cards/card.component';
import { DataTableComponent }      from '../../shared/ui/data-table/data-table.component';
import { LoadingOverlayComponent } from '../../shared/ui/loading-overlay/loading-overlay.component';
import { EmptyStateComponent }     from '../../shared/ui/empty-state/empty-state.component';
import { ToastService }            from '../../shared/ui/toast/toast.service';

import { AuthService }    from '../../services/auth.service';
import { VoucherService } from '../../services/voucher.service';
import { StandService }   from '../../services/stand.service';
import { ChargeService }  from '../../services/charge.service';
import { UserService }    from '../../services/user.service';

import { VoucherRequestDTO, VoucherResponseDTO, PaymentState } from '../../models/voucher';
import { VoucherItemRequestDTO, MeasureUnitType }              from '../../models/voucherItem';
import { StandResponseDTO }                                    from '../../models/stand';
import { ChargeResponseDTO }                                   from '../../models/charge';
import { CustomerResponseDTO }                                 from '../../models/user.response';

type Step = 'list' | 'select-stand' | 'new-voucher';

interface DraftItem {
  chargeQuery   : string;
  chargeReasonId: string;
  chargeDesc    : string;
  quantity      : number;
  unitValue     : number;
  measureUnit   : MeasureUnitType;
  suggestions   : ChargeResponseDTO[];
}

@Component({
  selector: 'app-sales-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppShellComponent,
    PageHeaderComponent,
    CardComponent,
    DataTableComponent,
    LoadingOverlayComponent,
    EmptyStateComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  template: `
<app-shell>
  <div class="sales-root">

    <!-- ───── PASO 1: lista de vouchers ───── -->
    @if (step() === 'list') {
      <app-page-header title="Mis Ventas" subtitle="Comprobantes emitidos">
        <button actions mat-flat-button color="primary" (click)="goSelectStand()">
          <mat-icon>add</mat-icon> Nueva Venta
        </button>
      </app-page-header>

      <app-loading-overlay [loading]="loadingVouchers()" text="Cargando ventas..." />

      @if (!loadingVouchers()) {
        @if (vouchers().length === 0) {
          <app-empty-state icon="receipt_long" title="Sin ventas" subtitle="Emite tu primer comprobante.">
            <button actions mat-stroked-button color="primary" (click)="goSelectStand()">
              <mat-icon>add</mat-icon> Nueva Venta
            </button>
          </app-empty-state>
        } @else {
          <app-data-table [rows]="vouchers()" [columns]="voucherColumns" />
        }
      }
    }

    <!-- ───── PASO 2: elegir puesto ───── -->
    @if (step() === 'select-stand') {
      <app-page-header title="Nueva Venta" subtitle="Elige el puesto desde el que emites">
        <button actions mat-stroked-button (click)="goList()">
          <mat-icon>arrow_back</mat-icon> Volver
        </button>
      </app-page-header>

      <app-loading-overlay [loading]="loadingStands()" text="Cargando puestos..." />

      @if (!loadingStands()) {
        @if (stands().length === 0) {
          <app-empty-state icon="store" title="Sin puestos" subtitle="No tienes puestos registrados." />
        } @else {
          <div class="stands-grid">
            @for (stand of stands(); track stand.id) {
              <app-card
                [title]="'Puesto ' + stand.number"
                [subtitle]="stand.description"
                icon="storefront"
                (click)="selectStand(stand)"
                style="cursor:pointer">
                <div card-footer>
                  <small style="opacity:.6">ID: {{ stand.id }}</small>
                </div>
              </app-card>
            }
          </div>
        }
      }
    }

    <!-- ───── PASO 3: formulario de nueva venta ───── -->
    @if (step() === 'new-voucher') {
      <app-page-header
        [title]="'Nueva Venta · Puesto ' + selectedStand()?.number"
        [subtitle]="selectedStand()?.description ?? ''">
        <button actions mat-stroked-button (click)="goSelectStand()">
          <mat-icon>arrow_back</mat-icon> Cambiar puesto
        </button>
      </app-page-header>

      <div class="voucher-form-grid">

        <!-- Bloque cliente -->
        <mat-card appearance="outlined">
          <mat-card-header><mat-card-title>Cliente</mat-card-title></mat-card-header>
          <mat-card-content style="padding-top:12px">
            <mat-form-field appearance="outline" style="width:100%">
              <mat-label>Buscar cliente por nombre</mat-label>
              <input matInput [formControl]="customerSearch"
                     placeholder="Escribe y presiona Enter"
                     (keydown.enter)="searchCustomers()" />
              <mat-hint>Presiona Enter para buscar</mat-hint>
            </mat-form-field>

            <app-loading-overlay [loading]="searchingCustomers()" text="Buscando..." />

            @if (customerResults().length > 0 && !selectedCustomer()) {
              <div class="customer-list">
                @for (c of customerResults(); track c.id) {
                  <div class="customer-option" (click)="pickCustomer(c)">
                    <mat-icon>person</mat-icon>
                    <span>{{ c.fullName }} &nbsp;<small style="opacity:.6">{{ c.username }}</small></span>
                  </div>
                }
              </div>
            }

            @if (selectedCustomer()) {
              <div class="customer-selected">
                <mat-icon color="primary">check_circle</mat-icon>
                <span><strong>{{ selectedCustomer()!.fullName }}</strong> — {{ selectedCustomer()!.username }}</span>
                <button mat-icon-button (click)="clearCustomer()" matTooltip="Cambiar cliente">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
            }
          </mat-card-content>
        </mat-card>

        <!-- Bloque ítems -->
        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-card-title>Ítems</mat-card-title>
            <div style="margin-left:auto">
              <button mat-stroked-button (click)="addItem()">
                <mat-icon>add</mat-icon> Agregar ítem
              </button>
            </div>
          </mat-card-header>
          <mat-card-content style="padding-top:12px; overflow-x:auto">

            @if (draftItems().length === 0) {
              <div style="text-align:center; padding:24px; color:rgba(0,0,0,.45)">
                <mat-icon style="font-size:36px; width:36px; height:36px">playlist_add</mat-icon>
                <p>Agrega al menos un ítem</p>
              </div>
            } @else {
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Motivo de cobro</th>
                    <th>Cant.</th>
                    <th>Unidad</th>
                    <th>P. Unit.</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of draftItems(); track $index; let i = $index) {
                    <tr>
                      <td style="min-width:200px; position:relative">
                        <mat-form-field appearance="outline" style="width:100%">
                          <input matInput
                                 [value]="item.chargeQuery"
                                 (input)="onChargeInput(i, $any($event.target).value)"
                                 (keydown.enter)="searchCharges(i)"
                                 placeholder="Descripción, Enter para buscar" />
                        </mat-form-field>
                        @if (item.suggestions.length > 0) {
                          <div class="charge-suggestions">
                            @for (s of item.suggestions; track s.id) {
                              <div class="charge-option" (click)="pickCharge(i, s)">{{ s.description }}</div>
                            }
                          </div>
                        }
                      </td>
                      <td>
                        <mat-form-field appearance="outline" style="width:80px">
                          <input matInput type="number" min="0.01"
                                 [value]="item.quantity"
                                 (change)="updateItem(i, 'quantity', $any($event.target).value)" />
                        </mat-form-field>
                      </td>
                      <td>
                        <mat-form-field appearance="outline" style="width:100px">
                          <mat-select [value]="item.measureUnit"
                                      (selectionChange)="updateItem(i, 'measureUnit', $event.value)">
                            @for (u of unitTypes; track u) {
                              <mat-option [value]="u">{{ u }}</mat-option>
                            }
                          </mat-select>
                        </mat-form-field>
                      </td>
                      <td>
                        <mat-form-field appearance="outline" style="width:100px">
                          <input matInput type="number" min="0"
                                 [value]="item.unitValue"
                                 (change)="updateItem(i, 'unitValue', $any($event.target).value)" />
                        </mat-form-field>
                      </td>
                      <td style="text-align:right; white-space:nowrap">
                        S/ {{ (item.quantity * item.unitValue).toFixed(2) }}
                      </td>
                      <td>
                        <button mat-icon-button color="warn" (click)="removeItem(i)">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            }

          </mat-card-content>
        </mat-card>

        <!-- Resumen y emitir -->
        <mat-card appearance="outlined" class="summary-card">
          <mat-card-header><mat-card-title>Resumen</mat-card-title></mat-card-header>
          <mat-card-content style="padding-top:12px">
            <div class="summary-row"><span>Subtotal</span><span>S/ {{ subtotal().toFixed(2) }}</span></div>
            <div class="summary-row"><span>IGV (18%)</span><span>S/ {{ igvAmount().toFixed(2) }}</span></div>
            <mat-divider style="margin:8px 0" />
            <div class="summary-row total"><span>Total</span><span>S/ {{ total().toFixed(2) }}</span></div>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-stroked-button (click)="goList()">Cancelar</button>
            <button mat-flat-button color="primary"
                    [disabled]="!canEmit() || emitting()"
                    (click)="emitVoucher()">
              @if (emitting()) {
                <mat-progress-spinner diameter="18" mode="indeterminate" />
              } @else {
                <mat-icon>receipt</mat-icon>
              }
              Emitir
            </button>
          </mat-card-actions>
        </mat-card>

      </div>
    }

  </div>
</app-shell>
  `,
  styles: [`
    .sales-root { padding: 0 4px; }

    .stands-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
      margin-top: 8px;
    }

    .voucher-form-grid {
      display: grid;
      gap: 16px;
      margin-top: 8px;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
    }
    .items-table th {
      text-align: left;
      padding: 4px 8px;
      font-size: 12px;
      opacity: .6;
      white-space: nowrap;
    }
    .items-table td { padding: 2px 8px; vertical-align: middle; }

    .charge-suggestions {
      position: absolute;
      z-index: 100;
      background: white;
      border: 1px solid rgba(0,0,0,.15);
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,.12);
      max-height: 180px;
      overflow-y: auto;
      width: 100%;
    }
    .charge-option {
      padding: 10px 14px;
      cursor: pointer;
      font-size: 14px;
    }
    .charge-option:hover { background: rgba(0,0,0,.05); }

    .customer-list {
      border: 1px solid rgba(0,0,0,.12);
      border-radius: 8px;
      overflow: hidden;
      margin-top: 4px;
    }
    .customer-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      cursor: pointer;
      font-size: 14px;
    }
    .customer-option:hover { background: rgba(0,0,0,.04); }

    .customer-selected {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 8px;
      background: rgba(0,128,0,.06);
      border: 1px solid rgba(0,128,0,.2);
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 14px;
    }
    .summary-row.total {
      font-weight: 700;
      font-size: 16px;
      padding-top: 8px;
    }
  `],
})
export class SalesPage implements OnInit {

  private auth           = inject(AuthService);
  private voucherService = inject(VoucherService);
  private standService   = inject(StandService);
  private chargeService  = inject(ChargeService);
  private userService    = inject(UserService);
  private toast          = inject(ToastService);

  readonly unitTypes = Object.values(MeasureUnitType);
  readonly IGV       = 0.18;

  step             = signal<Step>('list');
  loadingVouchers  = signal(false);
  loadingStands    = signal(false);
  emitting         = signal(false);
  searchingCustomers = signal(false);

  vouchers         = signal<VoucherResponseDTO[]>([]);
  stands           = signal<StandResponseDTO[]>([]);
  selectedStand    = signal<StandResponseDTO | null>(null);
  customerResults  = signal<CustomerResponseDTO[]>([]);
  selectedCustomer = signal<CustomerResponseDTO | null>(null);
  draftItems       = signal<DraftItem[]>([]);

  customerSearch = new FormControl('', { nonNullable: true });

  subtotal = computed(() =>
    this.draftItems().reduce((acc, i) => acc + i.quantity * i.unitValue, 0)
  );
  igvAmount = computed(() => this.subtotal() * this.IGV);
  total     = computed(() => this.subtotal() + this.igvAmount());

  canEmit = computed(() =>
    !!this.selectedCustomer() &&
    this.draftItems().length > 0 &&
    this.draftItems().every(i => !!i.chargeReasonId && i.quantity > 0 && i.unitValue >= 0)
  );

  voucherColumns = [
    { key: 'serialNumber', header: 'Nº Serie' },
    { key: 'issueDate',    header: 'Fecha',    cell: (r: VoucherResponseDTO) => new Date(r.issueDate).toLocaleDateString() },
    { key: 'payableAmount',header: 'Total',    cell: (r: VoucherResponseDTO) => `S/ ${Number(r.payableAmount).toFixed(2)}` },
    { key: 'state',        header: 'Estado',   cell: (r: VoucherResponseDTO) => this.stateLabel(r.state) },
  ];

  private get currentUserId(): bigint {
    return this.auth.getCurrentUser()!.id;
  }

  ngOnInit(): void {
    this.loadVouchers();
  }

  goList(): void {
    this.step.set('list');
    this.resetForm();
  }

  goSelectStand(): void {
    this.step.set('select-stand');
    this.loadStands();
  }

  selectStand(stand: StandResponseDTO): void {
    this.selectedStand.set(stand);
    this.draftItems.set([this.emptyItem()]);
    this.step.set('new-voucher');
  }

  loadVouchers(): void {
    this.loadingVouchers.set(true);
    this.voucherService.listPendingByIssuer(this.currentUserId).subscribe({
      next:  (rows) => { this.vouchers.set(rows ?? []); this.loadingVouchers.set(false); },
      error: (err: HttpErrorResponse) => {
        this.loadingVouchers.set(false);
        this.toast.error(err.error?.message ?? 'No se pudieron cargar las ventas.');
      },
    });
  }

  loadStands(): void {
    this.loadingStands.set(true);
    this.standService.listByOwner(this.currentUserId).subscribe({
      next:  (rows) => { this.stands.set(rows ?? []); this.loadingStands.set(false); },
      error: (err: HttpErrorResponse) => {
        this.loadingStands.set(false);
        this.toast.error(err.error?.message ?? 'No se pudieron cargar los puestos.');
      },
    });
  }

  searchCustomers(): void {
    const q = this.customerSearch.value.trim();
    if (!q) return;
    this.searchingCustomers.set(true);
    this.userService.searchByName(q).subscribe({
      next: (users) => {
        this.customerResults.set(users as CustomerResponseDTO[]);
        this.searchingCustomers.set(false);
      },
      error: () => { this.searchingCustomers.set(false); },
    });
  }

  pickCustomer(c: CustomerResponseDTO): void {
    this.selectedCustomer.set(c);
    this.customerResults.set([]);
  }

  clearCustomer(): void {
    this.selectedCustomer.set(null);
    this.customerSearch.setValue('');
    this.customerResults.set([]);
  }

  addItem(): void {
    this.draftItems.update(items => [...items, this.emptyItem()]);
  }

  removeItem(i: number): void {
    this.draftItems.update(items => items.filter((_, idx) => idx !== i));
  }

  onChargeInput(i: number, value: string): void {
    this.draftItems.update(items => {
      const copy = [...items];
      copy[i] = { ...copy[i], chargeQuery: value, chargeReasonId: '', chargeDesc: '', suggestions: [] };
      return copy;
    });
  }

  searchCharges(i: number): void {
    const stand = this.selectedStand();
    if (!stand) return;
    this.chargeService.findAllByStand(stand.id).subscribe({
      next: (charges) => {
        const q = this.draftItems()[i].chargeQuery.toLowerCase();
        const filtered = charges.filter(c => c.description.toLowerCase().includes(q) && c.active);
        this.draftItems.update(items => {
          const copy = [...items];
          copy[i] = { ...copy[i], suggestions: filtered };
          return copy;
        });
      },
    });
  }

  pickCharge(i: number, charge: ChargeResponseDTO): void {
    this.draftItems.update(items => {
      const copy = [...items];
      copy[i] = {
        ...copy[i],
        chargeReasonId: String(charge.id),
        chargeDesc    : charge.description,
        chargeQuery   : charge.description,
        suggestions   : [],
      };
      return copy;
    });
  }

  updateItem(i: number, field: 'quantity' | 'unitValue' | 'measureUnit', value: string): void {
    this.draftItems.update(items => {
      const copy = [...items];
      copy[i] = {
        ...copy[i],
        [field]: field === 'measureUnit' ? value : parseFloat(value) || 0,
      };
      return copy;
    });
  }

  emitVoucher(): void {
    if (!this.canEmit()) return;

    const customer = this.selectedCustomer()!;
    const stand    = this.selectedStand()!;

    const payload: VoucherRequestDTO = {
      igv         : String(this.IGV),
      issuerId    : String(this.currentUserId),
      customerId  : String(customer.id),
      standId     : String(stand.id),
      voucherItems: this.draftItems().map<VoucherItemRequestDTO>(item => ({
        chargeReasonId : item.chargeReasonId,
        quantity       : item.quantity as any,
        unitValue      : item.unitValue as any,
        measureUnitType: item.measureUnit,
      })),
    };

    this.emitting.set(true);
    this.voucherService.issue(payload).subscribe({
      next: (created) => {
        this.vouchers.update(list => [created, ...list]);
        this.toast.success(`Comprobante ${created.serialNumber} emitido correctamente.`);
        this.emitting.set(false);
        this.goList();
      },
      error: (err: HttpErrorResponse) => {
        this.emitting.set(false);
        this.toast.error(err.error?.message ?? 'No se pudo emitir el comprobante.');
      },
    });
  }

  private emptyItem(): DraftItem {
    return {
      chargeQuery   : '',
      chargeReasonId: '',
      chargeDesc    : '',
      quantity      : 1,
      unitValue     : 0,
      measureUnit   : MeasureUnitType.NIU,
      suggestions   : [],
    };
  }

  private resetForm(): void {
    this.selectedStand.set(null);
    this.selectedCustomer.set(null);
    this.customerResults.set([]);
    this.customerSearch.setValue('');
    this.draftItems.set([]);
  }

  private stateLabel(state: PaymentState): string {
    const map: Record<PaymentState, string> = {
      [PaymentState.PENDING]        : 'Pendiente',
      [PaymentState.PAID]           : 'Pagado',
      [PaymentState.PARTIALLY_PAID] : 'Pago parcial',
    };
    return map[state] ?? state;
  }
}
