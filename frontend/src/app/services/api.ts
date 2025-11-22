import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {
  CreateOrderPayload,
  CreateOrderResponse,
  Order,
  Product,
  User,
} from '@models/shop.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly apiBase = 'http://localhost/ecommerce/backend/public/api/';
  private readonly uploadsBase = 'http://localhost/ecommerce/backend/public/uploads/';
  private readonly credentialOptions = { withCredentials: true as const };

  constructor(private http: HttpClient) {}

  /** Returns a fully-qualified image URL for a filename returned by the API */
  buildImageUrl(filename?: string | null): string | null {
    if (!filename) { return null; }
    return this.uploadsBase + filename.replace(/^\/+/, '');
  }

  uploadImage(file: File): Observable<{ filename: string; url?: string }> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http
      .post<{ filename: string; url?: string }>(`${this.apiBase}uploads`, fd)
      .pipe(catchError(this.handleError('upload image')));
  }

  createProduct(data: Partial<Product>): Observable<Product> {
    return this.http
      .post<Product>(`${this.apiBase}products`, data)
      .pipe(catchError(this.handleError('create product')));
  }

  getProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(`${this.apiBase}products`)
      .pipe(catchError(this.handleError('get products')));
  }

  getProduct(id: number): Observable<Product> {
    return this.http
      .get<Product>(`${this.apiBase}products/${id}`)
      .pipe(catchError(this.handleError('get product')));
  }

  updateProduct(id: number, data: Partial<Product>): Observable<Product> {
    return this.http
      .put<Product>(`${this.apiBase}products/${id}`, data)
      .pipe(catchError(this.handleError('update product')));
  }

  getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.apiBase}users`)
      .pipe(catchError(this.handleError('get users')));
  }

  deleteProduct(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiBase}products/${id}`)
      .pipe(catchError(this.handleError('delete product')));
  }

  /** Places an order using the authenticated customer session */
  createOrder(data: CreateOrderPayload): Observable<CreateOrderResponse> {
    return this.http
      .post<CreateOrderResponse>(`${this.apiBase}orders.php`, data, this.credentialOptions)
      .pipe(catchError(this.handleError('create order')));
  }

  getMyOrders(): Observable<Order[]> {
    return this.http
      .get<Order[]>(`${this.apiBase}orders.php`, this.credentialOptions)
      .pipe(catchError(this.handleError('get my orders')));
  }

  private handleError(operation: string) {
    return (error: HttpErrorResponse) => {
      const apiMessage = error.error?.message || error.error?.error;
      const message = apiMessage || error.message || 'Unexpected error';
      return throwError(() => new Error(`${operation} failed: ${message}`));
    };
  }

}
