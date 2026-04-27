import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from './services/auth.service';

function hasAnyRole(userRoles: string[], requiredRoles: string[]): boolean {
  const set = new Set(userRoles);
  return requiredRoles.some(r => set.has(r));
}

function roleGuard(requiredRoles: string[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isLoggedIn()) {
      return router.parseUrl('/login');
    }

    const roles = auth.getCurrentUserRoles();
    if (!hasAnyRole(roles, requiredRoles)) {
      return router.parseUrl('/login');
    }

    return true;
  };
}

export const associationGuard: CanActivateFn = roleGuard(['ROLE_ASSOCIATION']);

export const vendorGuard: CanActivateFn = roleGuard(['ROLE_VENDOR', 'ROLE_ASSOCIATION']);

export const customerGuard: CanActivateFn = roleGuard(['ROLE_CUSTOMER']);


