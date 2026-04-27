import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { VoucherRequestDTO, VoucherResponseDTO } from '../models/voucher';
import { MeasureUnitTypeResponse } from '../models/voucherItem';

@Injectable({
  providedIn: 'root',
})
export class VoucherService {
  private http = inject(HttpClient);
  private apiUrl = `${API_BASE_URL}/vouchers`;

  findById(id: bigint): Observable<VoucherResponseDTO> {
    return this.http.get<VoucherResponseDTO>(`${this.apiUrl}/${id}`);
  }

  listByStand(standId: bigint): Observable<VoucherResponseDTO[]> {
    return this.http.get<VoucherResponseDTO[]>(`${this.apiUrl}/stand/${standId}`);
  }

  listByCustomer(customerId: bigint): Observable<VoucherResponseDTO[]> {
    return this.http.get<VoucherResponseDTO[]>(`${this.apiUrl}/customer/${customerId}`);
  }

  issue(request: VoucherRequestDTO): Observable<VoucherResponseDTO> {
    return this.http.post<VoucherResponseDTO>(`${this.apiUrl}`, request);
  }

  listPendingByCustomer(customerId: bigint): Observable<VoucherResponseDTO[]> {
    return this.http.get<VoucherResponseDTO[]>(`${this.apiUrl}/customer/${customerId}/pending`);
  }

  listPendingByIssuer(issuerId: bigint): Observable<VoucherResponseDTO[]> {
    return this.http.get<VoucherResponseDTO[]>(`${this.apiUrl}/issuer/${issuerId}/pending`);
  }

  listByStandDateBetween(
    standId: bigint,
    from: string,
    to: string
  ): Observable<VoucherResponseDTO[]> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<VoucherResponseDTO[]>(`${this.apiUrl}/stand/${standId}`, { params });
  }

  getUnitTypes(): Observable<MeasureUnitTypeResponse[]> {
    return this.http.get<MeasureUnitTypeResponse[]>(`${this.apiUrl}/unit-types`);
  }
}
