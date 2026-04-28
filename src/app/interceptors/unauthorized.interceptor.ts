import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../shared/ui/toast/toast.service';

export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err) => {
      if (err && err.status === 401) {
        try { auth.logout(); } catch {}
        try { toast.error('Sesión expirada. Por favor ingresa de nuevo.'); } catch {}
        try { router.navigateByUrl('/'); } catch {}
      }
      return throwError(() => err);
    })
  );
};


