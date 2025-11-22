import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    try {
      await firstValueFrom(this.auth.me());
      return true;
    } catch {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
