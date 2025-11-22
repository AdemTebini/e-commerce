import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { User } from '@models/shop.models';

interface LoginResponse {
  user: User;
  token?: string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly apiBase = 'http://localhost/ecommerce/backend/public/api/';
  private readonly credentialOptions = { withCredentials: true as const };
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<LoginResponse>(
        `${this.apiBase}login.php`,
        { email, password },
        this.credentialOptions,
      )
      .pipe(
        map((res) => res.user),
        tap((user) => this.currentUserSubject.next(user)),
        catchError(this.handleError('login')),
      );
  }

  me(): Observable<User> {
    return this.http
      .get<User>(`${this.apiBase}me.php`, this.credentialOptions)
      .pipe(
        tap((user) => this.currentUserSubject.next(user)),
        catchError((error) => {
          this.currentUserSubject.next(null);
          return this.handleError('fetch session')(error);
        })
      );
  }

  logout(): Observable<void> {
    return this.http
      .get<void>(`${this.apiBase}logout.php`, this.credentialOptions)
      .pipe(
        tap(() => this.currentUserSubject.next(null)),
        catchError(this.handleError('logout'))
      );
  }

  private handleError(operation: string) {
    return (error: HttpErrorResponse) => {
      const apiMessage = error.error?.message || error.error?.error;
      const message = apiMessage || error.message || 'Unexpected error';
      return throwError(() => new Error(`${operation} failed: ${message}`));
    };
  }
}
