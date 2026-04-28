import { Routes } from '@angular/router';
import { Register } from './register/register';
import {Login} from './pages/login/login';
import { LandingPage } from './pages/landing/landing';
import { HomePage } from './pages/home/home';
import { SalesPage } from './pages/sales/sales';
import { PurchasesPage } from './pages/purchases/purchases';
import { DebtsPage } from './pages/debts/debts';
import { ProfilePage } from './pages/profile/profile';
import { MyAssociationPage } from './pages/my-association/my-association';
import { StandsPage } from './pages/stands/stands';
import { StandDetailPage } from './pages/stands/stand-detail';
import {
  AssociationVendorsPage,
  AssociationCustomersPage,
  UsersPage,
  UserDetailPage,
  StandsByOwnerPage,
  VoucherDetailPage,
  VouchersByStandPage,
  VouchersByCustomerPage,
  VouchersPendingByCustomerPage,
  VouchersPendingByIssuerPage,
  VouchersRangeByStandPage,
  VoucherUnitTypesPage,
  PaymentDetailPage,
  PaymentsByCustomerPage,
  PaymentsByVoucherPage,
  PaymentsRangeByStandPage,
  ChargeReasonsPage,
  ChargeReasonDetailPage,
  ChargeReasonsByStandPage,
  DebtsImportPage,
  ReportCashClosurePage,
  ReportCustomerDebtsPage,
  ReportCashClosureExportPage,
  ReportCustomerDebtsExportPage,
} from './pages/_placeholders/placeholders';

import { AssociationMembersPage } from './pages/association-members/association-members';

import { associationGuard, customerGuard, vendorGuard } from './guards';
import { AuthRedirectGuard } from './guards/auth-redirect.guard';

const baseRoutes: Routes = [
  { path: '', component: LandingPage },
  { path: 'landing', component: LandingPage },
  { path: 'home', component: HomePage },
  { path: 'sales', component: SalesPage, canActivate: [vendorGuard] },
  { path: 'purchases', component: PurchasesPage, canActivate: [customerGuard] },
  { path: 'debts', component: DebtsPage, canActivate: [customerGuard] },
  { path: 'profile', component: ProfilePage },
  { path: 'my-association', component: MyAssociationPage, canActivate: [associationGuard] },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // Association
  { path: 'association/:associationId/vendors', component: AssociationVendorsPage, canActivate: [associationGuard]},
  { path: 'association/:associationId/customers', component: AssociationCustomersPage, canActivate: [associationGuard]},
  { path: 'association/:associationId/members', component: AssociationMembersPage, canActivate: [associationGuard]},

  // Users
  { path: 'users', component: UsersPage, canActivate: [associationGuard] },
  { path: 'users/:id', component: UserDetailPage, canActivate: [associationGuard]},

  // Stands
  { path: 'stands', component: StandsPage, canActivate: [vendorGuard] },
  { path: 'stands/:id', component: StandDetailPage, canActivate: [vendorGuard]},
  { path: 'stands/owner/:ownerId', component: StandsByOwnerPage, canActivate: [vendorGuard]},

  // Vouchers (vendor/customer)
  { path: 'vouchers/:id', component: VoucherDetailPage, canActivate: [vendorGuard]},
  { path: 'vouchers/stand/:standId', component: VouchersByStandPage, canActivate: [vendorGuard]},
  { path: 'vouchers/customer/:customerId', component: VouchersByCustomerPage, canActivate: [customerGuard]},
  { path: 'vouchers/customer/:customerId/pending', component: VouchersPendingByCustomerPage, canActivate: [customerGuard]},
  { path: 'vouchers/issuer/:issuerId/pending', component: VouchersPendingByIssuerPage, canActivate: [vendorGuard]},
  { path: 'vouchers/stand/:standId/range', component: VouchersRangeByStandPage, canActivate: [vendorGuard]},
  { path: 'vouchers/unit-types', component: VoucherUnitTypesPage, canActivate: [vendorGuard] },

  // Payments
  { path: 'payments/:id', component: PaymentDetailPage, canActivate: [vendorGuard]},
  { path: 'payments/customer/:customerId', component: PaymentsByCustomerPage, canActivate: [customerGuard]},
  { path: 'payments/voucher/:voucherId', component: PaymentsByVoucherPage, canActivate: [vendorGuard] },
  { path: 'payments/stand/:standId/range', component: PaymentsRangeByStandPage, canActivate: [vendorGuard]},

  // Charge reasons
  { path: 'charge-reasons', component: ChargeReasonsPage, canActivate: [vendorGuard] },
  { path: 'charge-reasons/:id', component: ChargeReasonDetailPage, canActivate: [vendorGuard]},
  { path: 'charge-reasons/stand/:standId', component: ChargeReasonsByStandPage, canActivate: [vendorGuard]},

  // Debts import
  { path: 'debts/import', component: DebtsImportPage, canActivate: [associationGuard] },

  // Reports
  { path: 'reports/cash-closure', component: ReportCashClosurePage, canActivate: [associationGuard] },
  { path: 'reports/customer-debts', component: ReportCustomerDebtsPage, canActivate: [associationGuard] },
  { path: 'reports/cash-closure/export', component: ReportCashClosureExportPage, canActivate: [associationGuard] },
  { path: 'reports/customer-debts/export', component: ReportCustomerDebtsExportPage, canActivate: [associationGuard] },

  { path: '**', redirectTo: ''}
];

const WHITELIST = new Set(['', 'landing', 'login', 'register', '**']);

export const routes: Routes = baseRoutes.map(r => {
  const path = r.path ?? '';
  if (WHITELIST.has(path)) return r;
  const existing = r.canActivate ?? [];
  if (existing.includes(AuthRedirectGuard as any)) return r;
  return { ...r, canActivate: [AuthRedirectGuard, ...existing] };
});

