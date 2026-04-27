import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { PaymentRequestDTO, PaymentResponseDTO } from '../models/payment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = `${API_BASE_URL}/payments`;

  findById(id: bigint): Observable<PaymentResponseDTO> {
    return this.http.get<PaymentResponseDTO>(`${this.apiUrl}/${id}`);
  }

  listByCustomer(customerId: bigint): Observable<PaymentResponseDTO[]> {
    return this.http.get<PaymentResponseDTO[]>(`${this.apiUrl}/customer/${customerId}`);
  }

  listByVoucher(voucherId: bigint): Observable<PaymentResponseDTO[]> {
    return this.http.get<PaymentResponseDTO[]>(`${this.apiUrl}/voucher/${voucherId}`);
  }

  payVoucherItems(request: PaymentRequestDTO): Observable<PaymentResponseDTO> {
    return this.http.post<PaymentResponseDTO>(`${this.apiUrl}`, request);
  }

  listPaymentsByStandAndDateTimeBetween(
    standId: bigint,
    from: string,
    to: string
  ): Observable<PaymentResponseDTO[]> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<PaymentResponseDTO[]>(`${this.apiUrl}/stand/${standId}`, { params });
  }
}
