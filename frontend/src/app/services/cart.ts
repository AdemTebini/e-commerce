import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem, Product } from '@models/shop.models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private static readonly STORAGE_KEY = 'cart_items';
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>(
    CartService.safeParse(localStorage.getItem(CartService.STORAGE_KEY)),
  );
  /** Emits the current cart content so UI screens stay in sync. */
  readonly items$ = this.itemsSubject.asObservable();

  private static safeParse(raw: string | null): CartItem[] {
    if (!raw) { return []; }
    try {
      const parsed = JSON.parse(raw) as CartItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      localStorage.removeItem(CartService.STORAGE_KEY);
      return [];
    }
  }

  private persist(cart: CartItem[]): void {
    localStorage.setItem(CartService.STORAGE_KEY, JSON.stringify(cart));
    this.itemsSubject.next([...cart]);
  }

  getCart(): CartItem[] {
    return [...this.itemsSubject.value];
  }

  addItem(product: Product, quantity: number = 1): void {
    const cart = this.getCart();
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock);
    } else {
      cart.push({ ...product, quantity: Math.min(quantity, product.stock) });
    }

    this.persist(cart);
  }

  /** Backwards-compatible alias used by older components. */
  addToCart(product: Product, quantity: number = 1): void {
    this.addItem(product, quantity);
  }

  updateQuantity(productId: number, quantity: number): void {
    const cart = this.getCart();
    const item = cart.find((x) => x.id === productId);
    if (!item) { return; }

    item.quantity = Math.max(1, Math.min(quantity, item.stock));
    this.persist(cart);
  }

  removeItem(productId: number): void {
    const filtered = this.getCart().filter((x) => x.id !== productId);
    this.persist(filtered);
  }

  remove(productId: number): void {
    this.removeItem(productId);
  }

  clearCart(): void {
    localStorage.removeItem(CartService.STORAGE_KEY);
    this.itemsSubject.next([]);
  }

  clear(): void {
    this.clearCart();
  }

  getTotal(): number {
    return this.calculateTotal();
  }

  calculateTotal(): number {
    return this.itemsSubject.value.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }
}
