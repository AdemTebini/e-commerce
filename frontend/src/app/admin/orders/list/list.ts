import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-orders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class OrdersListComponent implements OnInit {
  orders: any[] = [];
  loading = false;
  err = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.getMyOrders().subscribe({
      next: (res) => {
        this.orders = res || [];
        this.loading = false;
      },
      error: () => {
        this.err = 'Unable to load orders.';
        this.loading = false;
      }
    });
  }

  view(order: any): void {
    if (!order?.id) {
      return;
    }
    this.router.navigate(['/admin/orders', order.id]);
  }

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'pending',
      'processing': 'processing',
      'completed': 'completed',
      'cancelled': 'cancelled'
    };
    return statusMap[status?.toLowerCase()] || 'pending';
  }

  getStatusLabel(status: string): string {
    const labelMap: Record<string, string> = {
      'pending': 'En attente',
      'processing': 'En cours',
      'completed': 'Terminée',
      'cancelled': 'Annulée'
    };
    return labelMap[status?.toLowerCase()] || 'En attente';
  }
}
