import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { User } from '../../models/shop.models';
@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent {
  readonly logoSrc = 'http://localhost/ecommerce/backend/public/uploads/logo1.png';

  @Output() readonly toggleMenu = new EventEmitter<void>();
  @Output() readonly logoutRequested = new EventEmitter<void>();

  @Input() currentUser: User | null = null;
  @Input() loadingUser = false;
  @Input() logoutPending = false;

  protected onToggleMenu(): void {
    this.toggleMenu.emit();
  }

  protected logout(): void {
    this.logoutRequested.emit();
  }

  protected getInitials(user: User | null): string {
    if (!user) {
      return '';
    }
    const source = user.name || user.email || '';
    return source
      .split(' ')
      .map(part => part[0])
      .filter(Boolean)
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}
