import { Injectable, inject } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { UserRequest } from '../models/user.request';
import {AssociationResponseDTO, CustomerResponseDTO, UserResponse, VendorResponseDTO} from '../models/user.response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${API_BASE_URL}/users`;

  findAll(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.apiUrl}`);
  }

  findById(id: bigint): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`);
  }

  register(request: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/register`, request);
  }

  update(id: bigint, request: UserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: bigint): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  disable(id: bigint): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/${id}/deactivate`, null);
  }

  enable(id: bigint): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/${id}/activate`, null);
  }

  block(id: bigint): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/${id}/block`, null);
  }

  searchByName(q: string): Observable<UserResponse[]> {
    let params = new HttpParams();
    params = params.set("string", q);
    return this.http.get<UserResponse[]>(`${this.apiUrl}/search`, {params});
  }
}
