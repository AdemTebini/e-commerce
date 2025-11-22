import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  loading = false;
  err = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.api.getUsers().subscribe({
      next: (res) => { 
        this.users = res || [];
        this.loading = false;
      },
      error: () => { 
        this.err = 'Échec du chargement des utilisateurs';
        this.loading = false;
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getRoleLabel(role: string): string {
    const roleMap: Record<string, string> = {
      'admin': 'Administrateur',
      'client': 'Client',
      'user': 'Utilisateur'
    };
    return roleMap[role?.toLowerCase()] || 'Utilisateur';
  }

  countAdmins(): number {
    return this.users.filter(u => u.role?.toLowerCase() === 'admin').length;
  }

  countClients(): number {
    return this.users.filter(u => u.role?.toLowerCase() !== 'admin').length;
  }
}
