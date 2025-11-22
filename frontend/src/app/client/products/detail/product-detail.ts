import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api';
import { CartService } from '../../../services/cart';
import { ToastService } from '../../../services/toast';
import { Product } from '@models/shop.models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  err = '';
  loading = true;
  quantity = 1;
  selectedImage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private cart: CartService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.err = 'ID produit invalide';
      this.loading = false;
      return;
    }
    this.loadProduct(id);
  }

  loadProduct(id: number) {
    this.loading = true;
    this.err = '';
    this.api.getProduct(id).subscribe({
      next: (res: Product) => {
        this.product = res;
        this.selectedImage = res.main_image || '';
        this.loading = false;
      },
      error: () => {
        this.err = 'Produit introuvable';
        this.loading = false;
      }
    });
  }

  incrementQuantity() {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (this.product) {
      this.cart.addToCart(this.product, this.quantity);
      this.toast.success(`${this.product.title} (×${this.quantity}) ajouté au panier! 🛒`, 3500);
    }
  }

  buyNow() {
    if (this.product) {
      this.cart.addToCart(this.product, this.quantity);
      this.router.navigate(['/checkout']);
    }
  }

  getImageUrl(imageName: string): string {
    return imageName ? `http://localhost/ecommerce/backend/public/uploads/${imageName}` : 'https://via.placeholder.com/600x400?text=No+Image';
  }

  selectImage(image: string) {
    this.selectedImage = image;
  }
}
