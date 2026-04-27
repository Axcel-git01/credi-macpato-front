import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { ChargeRequestDTO, ChargeResponseDTO } from '../models/charge';

@Injectable({
  providedIn: 'root',
})
export class ChargeService {
  private http = inject(HttpClient);
  private apiUrl = `${API_BASE_URL}/charge-reasons`;

  findAll(): Observable<ChargeResponseDTO[]> {
    return this.http.get<ChargeResponseDTO[]>(`${this.apiUrl}`);
  }

  findAllByStand(standId: bigint): Observable<ChargeResponseDTO[]> {
    return this.http.get<ChargeResponseDTO[]>(`${this.apiUrl}/stand/${standId}`);
  }

  findById(id: bigint): Observable<ChargeResponseDTO> {
    return this.http.get<ChargeResponseDTO>(`${this.apiUrl}/${id}`);
  }

  create(request: ChargeRequestDTO): Observable<ChargeResponseDTO> {
    return this.http.post<ChargeResponseDTO>(`${this.apiUrl}`, request);
  }

  update(id: bigint, request: ChargeRequestDTO): Observable<ChargeResponseDTO> {
    return this.http.put<ChargeResponseDTO>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: bigint): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
