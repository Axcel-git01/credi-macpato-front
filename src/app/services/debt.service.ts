import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { FileType } from '../models/report';

@Injectable({
  providedIn: 'root',
})
export class DebtService {
  private http = inject(HttpClient);
  private apiUrl = `${API_BASE_URL}/debts`;

  /**
   * POST /api/debts/import (multipart/form-data)
   * Partes:
   *  - file: MultipartFile
   *  - fileType: FileType
   */
  bulkImport(file: File, fileType: FileType): Observable<unknown> {
    const form = new FormData();
    form.append('file', file);
    // Spring generalmente recibe enums como string ("CSV"/"PDF"/"EXCEL").
    form.append('fileType', FileType[fileType]);
    return this.http.post<unknown>(`${this.apiUrl}/import`, form);
  }
}
