import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost/ecommerce/backend/public/api/';
  private uploadsBase = 'http://localhost/ecommerce/backend/public/uploads/';

  constructor(private http: HttpClient) {}

  /** Returns a fully-qualified image URL for a filename returned by the API */
  buildImageUrl(filename?: string | null): string | null {
    if (!filename) { return null; }
    return this.uploadsBase + filename.replace(/^\/+/, '');
  }

  uploadImage(file: File): Observable<any> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post(`${this.base}uploads`, fd);
  }

  createProduct(data: any) { return this.http.post(`${this.base}products`, data); }
  getProducts() { return this.http.get<any[]>(`${this.base}products`); }
  getProduct(id: number) { return this.http.get<any>(`${this.base}products/${id}`); }
  updateProduct(id: number, data: any) { return this.http.put(`${this.base}products/${id}`, data); }
  deleteProduct(id: number) { return this.http.delete(`${this.base}products/${id}`); }
}
