import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

import {API_BASE_URL} from '../config/api.config';
import { LoginRequestDTO, LoginResponseDTO } from '../models/login';
import {UserResponse} from '../models/user.response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${API_BASE_URL}/auth`;

  login(loginRequest: LoginRequestDTO) {
    return this.http.post<LoginResponseDTO>(`${this.apiUrl}/login`, loginRequest).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      })
    );
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  getCurrentUser(): UserResponse | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserResponse;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  }

  getCurrentUserRoles(): string[] {
    const user = this.getCurrentUser();
    if (!user) return [];

    const rawRole = (user as unknown as { role?: string }).role;
    if (!rawRole) return [];

    const normalized = rawRole.startsWith('ROLE_') ? rawRole : `ROLE_${rawRole}`;
    return [normalized];
  }

  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    // Esto verifica si estamos en el navegador para evitar errores de SSR
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }
}
