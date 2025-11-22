import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class OrdersComponent implements OnInit {

  orders: any[] = [];
  loading = false;
  err = '';

  readonly statusBadges: Record<string, string> = {
    pending: 'En attente',
    paid: 'Payée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.err = '';
    this.api.getMyOrders().subscribe({
      next: res => {
        this.orders = res;
        this.loading = false;
      },
      error: e => {
        this.err = e.error?.error || 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }

  trackById(_: number, order: any) {
    return order?.id ?? _;
  }

  statusLabel(status: string) {
    return this.statusBadges[status] || status || 'En attente';
  }

}
