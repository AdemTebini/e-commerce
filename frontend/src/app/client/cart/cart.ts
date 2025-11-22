import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {

  cartItems: any[] = [];
  subtotal = 0;
  shipping = 7.00; // Fixed shipping cost
  message = '';

  constructor(private cart: CartService, private router: Router) {}

  ngOnInit() {
    this.syncCart();
  }

  getImageUrl(filename?: string): string {
    if (!filename) {
      return 'https://via.placeholder.com/150?text=No+Image';
    }
    return 'http://localhost/ecommerce/backend/public/uploads/' + filename;
  }

  increaseQty(id: number, currentQty: number) {
    this.cart.updateQuantity(id, currentQty + 1);
    this.syncCart();
  }

  decreaseQty(id: number, currentQty: number) {
    if (currentQty > 1) {
      this.cart.updateQuantity(id, currentQty - 1);
      this.syncCart();
    }
  }

  remove(id: number) {
    this.cart.remove(id);
    this.syncCart();
    this.message = 'Produit supprimé du panier';
    setTimeout(() => this.message = '', 2000);
  }

  update(id: number, qty: number) {
    const quantity = Math.max(1, qty || 1);
    this.cart.updateQuantity(id, quantity);
    this.syncCart();
  }

  clearCart() {
    if (confirm('Voulez-vous vraiment vider le panier ?')) {
      this.cart.clear();
      this.syncCart();
      this.message = 'Panier vidé';
      setTimeout(() => this.message = '', 2000);
    }
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }

  private syncCart() {
    this.cartItems = this.cart.getCart();
    this.subtotal = this.cart.getTotal();
  }
}
