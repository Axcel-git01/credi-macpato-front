import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { StandRequestDTO, StandResponseDTO } from '../models/stand';

@Injectable({
  providedIn: 'root',
})
export class StandService {
  private http = inject(HttpClient);
  private apiUrl = `${API_BASE_URL}/stands`;

  findAll(): Observable<StandResponseDTO[]> {
    return this.http.get<StandResponseDTO[]>(`${this.apiUrl}`);
  }

  findById(id: bigint): Observable<StandResponseDTO> {
    return this.http.get<StandResponseDTO>(`${this.apiUrl}/${id}`);
  }

  listByOwner(ownerId: bigint): Observable<StandResponseDTO[]> {
    return this.http.get<StandResponseDTO[]>(`${this.apiUrl}/owner/${ownerId}`);
  }

  create(request: StandRequestDTO): Observable<StandResponseDTO> {
    return this.http.post<StandResponseDTO>(`${this.apiUrl}`, request);
  }

  update(id: bigint, request: StandRequestDTO): Observable<StandResponseDTO> {
    return this.http.put<StandResponseDTO>(`${this.apiUrl}/${id}`, request);
  }

  changeOwner(id: bigint, newOwnerId: bigint): Observable<StandResponseDTO> {
    return this.http.post<StandResponseDTO>(`${this.apiUrl}/${id}/change-owner/${newOwnerId}`, null);
  }

  delete(id: bigint): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
