import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    try {
      const user = await firstValueFrom(this.auth.me());
      if (user.role === 'admin') {
        return true;
      }
    } catch {
      // Handle error
    }
    this.router.navigate(['/login']);
    return false;
  }
}
