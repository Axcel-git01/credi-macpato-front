import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { CashClosureReport, CashClosureReportRequest, CustomerDebtsReportRequest, FileType } from '../models/report';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private http = inject(HttpClient);
  private apiUrl = `${API_BASE_URL}/reports`;

  cashClosure(request: CashClosureReportRequest): Observable<CashClosureReport> {
    return this.http.post<CashClosureReport>(`${this.apiUrl}/cash-closure`, request);
  }

  customerDebts(request: CustomerDebtsReportRequest): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/customer-debts`, request);
  }

  exportCashClosure(fileType: FileType, request: CashClosureReportRequest): Observable<Blob> {
    const params = new HttpParams().set('fileType', FileType[fileType]);
    return this.http.post(`${this.apiUrl}/cash-closure/export`, request, {
      params,
      responseType: 'blob',
    });
  }

  exportCustomerDebts(fileType: FileType, request: CustomerDebtsReportRequest): Observable<Blob> {
    const params = new HttpParams().set('fileType', FileType[fileType]);
    return this.http.post(`${this.apiUrl}/customer-debts/export`, request, {
      params,
      responseType: 'blob',
    });
  }
}
