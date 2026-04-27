import { Routes } from '@angular/router';
import { Register } from './register/register';
import {Login} from './pages/login/login';

import { associationGuard, customerGuard, vendorGuard } from './guards';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // Association
  { path: 'association/:associationId/vendors', component: Login, canActivate: [associationGuard]},
  { path: 'association/:associationId/customers', component: Login, canActivate: [associationGuard]},
  { path: 'association/:associationId/members', component: Login, canActivate: [associationGuard]},

  // Users
  { path: 'users', component: Login, canActivate: [associationGuard] },
  { path: 'users/:id', component: Login, canActivate: [associationGuard]},

  // Stands
  { path: 'stands', component: Login, canActivate: [associationGuard] },
  { path: 'stands/:id', component: Login, canActivate: [associationGuard]},
  { path: 'stands/owner/:ownerId', component: Login, canActivate: [associationGuard]},

  // Vouchers (vendor/customer)
  { path: 'vouchers/:id', component: Login, canActivate: [vendorGuard]},
  { path: 'vouchers/stand/:standId', component: Login, canActivate: [vendorGuard]},
  { path: 'vouchers/customer/:customerId', component: Login, canActivate: [customerGuard]},
  { path: 'vouchers/customer/:customerId/pending', component: Login, canActivate: [customerGuard]},
  { path: 'vouchers/issuer/:issuerId/pending', component: Login, canActivate: [vendorGuard]},
  { path: 'vouchers/stand/:standId/range', component: Login, canActivate: [vendorGuard]},
  { path: 'vouchers/unit-types', component: Login, canActivate: [vendorGuard] },

  // Payments
  { path: 'payments/:id', component: Login, canActivate: [vendorGuard]},
  { path: 'payments/customer/:customerId', component: Login, canActivate: [customerGuard]},
  { path: 'payments/voucher/:voucherId', component: Login, canActivate: [vendorGuard] },
  { path: 'payments/stand/:standId/range', component: Login, canActivate: [vendorGuard]},

  // Charge reasons
  { path: 'charge-reasons', component: Login, canActivate: [vendorGuard] },
  { path: 'charge-reasons/:id', component: Login, canActivate: [vendorGuard]},
  { path: 'charge-reasons/stand/:standId', component: Login, canActivate: [vendorGuard]},

  // Debts import
  { path: 'debts/import', component: Login, canActivate: [associationGuard] },

  // Reports
  { path: 'reports/cash-closure', component: Login, canActivate: [associationGuard] },
  { path: 'reports/customer-debts', component: Login, canActivate: [associationGuard] },
  { path: 'reports/cash-closure/export', component: Login, canActivate: [associationGuard] },
  { path: 'reports/customer-debts/export', component: Login, canActivate: [associationGuard] },

  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: '**', redirectTo: 'login'}
];
