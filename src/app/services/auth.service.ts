import {Injectable, inject, computed} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';

import {API_BASE_URL} from '../config/api.config';
import { LoginRequestDTO, LoginResponseDTO } from '../models/login';
import {UserResponse} from '../models/user.response';
import {jwtDecode, JwtPayload} from 'jwt-decode';

interface JwtCustomPayload extends JwtPayload {
  roles?: string[] | string;
  authorities?: string[] | string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${API_BASE_URL}/auth`;

  roles = computed(() => this.getCurrentUserRoles());
  isAssociation = computed(() => this.roles().includes('ROLE_ASSOCIATION'));
  isVendor = computed(() => this.roles().includes('ROLE_VENDOR'));
  isCustomer = computed(() => this.roles().includes('ROLE_CUSTOMER'));

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
  if (!this.getToken()) return [];
  const token: string = this.getToken()!;

  const decoded = jwtDecode<JwtCustomPayload>(token);

  const rawRoles = decoded.roles ?? decoded.authorities;
  if (!rawRoles) return [];

  const rolesArray: string[] = Array.isArray(rawRoles)
    ? rawRoles.map(String)
    : [String(rawRoles)];

  return rolesArray.map(r => r.startsWith('ROLE_') ? r : `ROLE_${r}`);
}


logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }
}
