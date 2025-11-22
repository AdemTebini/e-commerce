import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';
import { CartService } from '../../services/cart';
import { ToastService } from '../../services/toast';
import { Product } from '@models/shop.models';

@Component({
  selector: 'app-client-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class ClientProductsComponent implements OnInit {

  products: Product[] = [];
  loading = true;
  err = '';

  constructor(
    private api: ApiService,
    private cart: CartService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.err = '';

    this.api.getProducts().subscribe({
      next: (res: Product[]) => {
        this.products = res;
        this.loading = false;
      },
      error: () => {
        this.err = 'Une erreur est survenue. Réessayez ultérieurement.';
        this.loading = false;
      }
    });
  }

  add(p: Product) {
    this.cart.addToCart(p, 1);
    this.toast.success(`${p.title} ajouté au panier avec succès! 🛒`, 3500);
  }
}
