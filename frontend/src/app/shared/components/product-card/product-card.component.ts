import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '@models/shop.models';
import { PricePipe } from '../../pipes/price.pipe';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, PricePipe, TruncatePipe],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input() product?: Product;
  @Input() actionLabel = 'Add to cart';
  @Output() action = new EventEmitter<Product>();

  emitAction(): void {
    if (this.product) {
      this.action.emit(this.product);
    }
  }
}
