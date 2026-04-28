import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard que redirige al landing ('/') si el usuario no está autenticado.
 * Use como canActivate en rutas que requieran sesión.
 */
const WHITELIST = ['/', '/landing', '/login', '/register'];

export const authRedirectGuard: CanActivateFn = (_route, _state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const url = (_state as any).url?.split('?')[0] ?? '/';

  if (WHITELIST.includes(url)) return true;

  const logged = auth.isLoggedIn();
  if (logged) return true;

  return router.parseUrl('/');
};

export const AuthRedirectGuard = authRedirectGuard;

