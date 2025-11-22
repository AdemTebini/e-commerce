import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {};

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.me().subscribe({
      next: (res) => {
        this.user = res || {};
      },
      error: () => {
        this.user = { name: 'Utilisateur', email: 'user@example.com' };
      }
    });
  }

  getInitials(): string {
    if (!this.user?.name) return '?';
    const parts = this.user.name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return this.user.name.substring(0, 2).toUpperCase();
  }

  getRoleLabel(): string {
    const roleMap: Record<string, string> = {
      'admin': 'Administrateur',
      'client': 'Client',
      'user': 'Utilisateur'
    };
    return roleMap[this.user?.role?.toLowerCase()] || 'Utilisateur';
  }
}
