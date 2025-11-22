import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { take, finalize } from 'rxjs';
import { AdminHeaderComponent } from './admin/admin-header/admin-header.component';
import { AdminSideNavComponent } from './admin/admin-side-nav/admin-side-nav.component';
import { ClientSideNavComponent } from './shared/navigation/client-side-nav.component';
import { DefaultSideNavComponent } from './shared/navigation/default-side-nav.component';
import { AuthService } from './services/auth';
import { User } from './models/shop.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgSwitch, NgSwitchCase, NgSwitchDefault, AdminHeaderComponent, AdminSideNavComponent, ClientSideNavComponent, DefaultSideNavComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly title = signal('frontend');
  protected readonly menuOpen = signal(true);
  protected readonly currentUser = signal<User | null>(null);
  protected readonly loadingUser = signal(true);
  protected readonly logoutPending = signal(false);

  protected readonly navVariant = computed<'admin' | 'client' | 'default'>(() => {
    const user = this.currentUser();
    if (!user) {
      return 'default';
    }
    return user.role === 'admin' ? 'admin' : 'client';
  });

  constructor() {
    this.observeSession();
    this.refreshSession();
  }

  protected toggleMenu(): void {
    this.menuOpen.update((state) => !state);
  }

  protected handleLogout(): void {
    if (this.logoutPending()) {
      return;
    }

    this.logoutPending.set(true);
    this.authService
      .logout()
      .pipe(
        take(1),
        finalize(() => this.logoutPending.set(false))
      )
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: () => undefined
      });
  }

  private refreshSession(): void {
    this.loadingUser.set(true);

    this.authService
      .me()
      .pipe(
        take(1),
        finalize(() => this.loadingUser.set(false))
      )
      .subscribe({ error: () => undefined });
  }

  private observeSession(): void {
    this.authService.currentUser$.subscribe((user) => this.currentUser.set(user));
  }
}
