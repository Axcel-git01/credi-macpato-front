import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { API_BASE_URL} from '../config/api.config';
import { AuthService } from './auth.service';
import {ErrorResponse} from '../models/error.response';

const PUBLIC_PATHS = ['/auth/login', '/auth/register'];

function isPublicUrl(url: string): boolean {
  return PUBLIC_PATHS.some(p => url.includes(p));
}

function isApiUrl(url: string): boolean {
  return url.startsWith(API_BASE_URL);
}

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (!isApiUrl(req.url) || isPublicUrl(req.url) || req.headers.has('Authorization')) {
	return next(req);
  }

  const token = authService.getToken();
  const authReq = token
	? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
	: req;

  return next(authReq).pipe(
	catchError((err: ErrorResponse) => {
	  if (err.status === 401) {
		authService.logout();
	  }
	  return throwError(() => err);
	})
  );
};

