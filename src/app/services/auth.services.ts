import { Injectable, inject } from '@angular/core'; // <-- Injectable viene de @angular/core
import { HttpClient } from '@angular/common/http'; // <-- HttpClient viene de aquí
import { tap } from 'rxjs'; // <-- Esto viene de rxjs

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/auth'; 

  login(loginRequest: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, loginRequest).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response));
        }
      })
    );
  }

  // En auth.services.ts
register(userData: any) {
  // Ajusta la URL según tu backend, por ejemplo: /api/auth/register
  return this.http.post<any>(`${this.apiUrl}/register`, userData);
}

  isLoggedIn(): boolean {
    // Esto verifica si estamos en el navegador para evitar errores de SSR
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }
}