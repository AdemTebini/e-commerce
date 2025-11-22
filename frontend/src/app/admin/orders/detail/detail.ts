import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api';

@Component({
  selector: 'app-admin-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail.html',
  styleUrls: ['./detail.css']
})
export class OrderDetailComponent implements OnInit {
  order: any;
  err = '';

  constructor(
    private route: ActivatedRoute, 
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.err = 'Invalid order id';
      return;
    }
    this.api.getMyOrders().subscribe({
      next: (orders) => {
        this.order = (orders || []).find(o => Number(o.id) === id);
        if (!this.order) {
          this.err = 'Order not found';
        }
      },
      error: () => {
        this.err = 'Unable to load order.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/orders']);
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

  calculateSubtotal(): number {
    if (!this.order?.items) return 0;
    return this.order.items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);
  }
}
