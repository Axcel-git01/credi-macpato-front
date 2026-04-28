import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { UserResponse } from '../models/user.response';

@Injectable({
  providedIn: 'root',
})
export class AssociationService {
  private http = inject(HttpClient);
  private apiUrl = `${API_BASE_URL}/associations`;

  listVendors(associationId: bigint): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.apiUrl}/${associationId}/vendors`);
  }

  listCustomers(associationId: bigint): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.apiUrl}/${associationId}/customers`);
  }

  listMembers(associationId: bigint): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.apiUrl}/${associationId}/members`);
  }

  listAll(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.apiUrl}`);
  }
}
