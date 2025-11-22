import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart';
import { ApiService } from '../../services/api';
import { Router } from '@angular/router';
import { CartItem, CreateOrderPayload } from '@models/shop.models';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {

  items: CartItem[] = [];
  total = 0;

  fullName = '';
  phone = '';
  line1 = '';
  line2 = '';
  city = '';
  postalCode = '';
  paymentMethod: 'cod' | 'card' = 'cod';
  deliveryWindow = '48h - 72h';

  loading = false;
  msg = '';
  err = '';
  private readonly subscriptions = new Subscription();

  constructor(
    private cart: CartService,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    const cartSync = this.cart.items$.subscribe((items) => {
      this.items = items;
      this.total = this.cart.calculateTotal();
      if (!items.length) {
        this.router.navigate(['/cart']);
      }
    });

    this.subscriptions.add(cartSync);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  goToProducts() {
    this.router.navigate(['/']);
  }

  get shippingFee() {
    return this.total >= 150 ? 0 : 12;
  }

  get grandTotal() {
    return this.total + this.shippingFee;
  }

  submit() {
    if (!this.fullName || !this.line1 || !this.city) {
      this.err = 'Veuillez remplir au moins le nom, l’adresse et la ville.';
      this.msg = '';
      return;
    }

    this.loading = true;
    this.err = '';
    this.msg = '';

    const payload: CreateOrderPayload = {
      address: {
        full_name: this.fullName,
        phone: this.phone,
        line1: this.line1,
        line2: this.line2,
        city: this.city,
        postal_code: this.postalCode,
        country: 'Tunisia',
      },
      payment_method: this.paymentMethod,
      items: this.items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };

    this.api
      .createOrder(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.msg = 'Commande créée avec succès. Numéro: ' + res.order_id;
          this.cart.clearCart();
          setTimeout(() => this.router.navigate(['/orders']), 1000);
        },
        error: (error: Error) => {
          this.err = error.message;
        },
      });
  }
}
