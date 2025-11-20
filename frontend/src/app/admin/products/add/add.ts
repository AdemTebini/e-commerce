import { Component } from '@angular/core';
import { ApiService } from '../../../services/api';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add.html',
  styleUrls: ['./add.css']
})
export class AddComponent {

  title = '';
  description = '';
  price = 0;
  stock = 0;

  file?: File;

  msg = '';
  err = '';

  constructor(private api: ApiService) {}

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.file = input.files?.[0] || undefined;
    this.msg = '';
  }

  async addProduct() {
    try {
      this.msg = 'Processing...';

      let filename = null;

      // upload image
      if (this.file) {
        const uploadResponse: any = await firstValueFrom(this.api.uploadImage(this.file));
        filename = uploadResponse?.filename || null;
      }

      // create product
      const payload = {
        title: this.title,
        description: this.description,
        price: this.price,
        stock: this.stock,
        image: filename
      };

      const res: any = await firstValueFrom(this.api.createProduct(payload));

      this.msg = 'Product added with id: ' + res.product_id;
      this.err = '';

      this.resetForm();

    } catch (e: any) {
      this.err = e?.error?.error || 'Error';
      this.msg = '';
    }
  }

  resetForm() {
    this.title = '';
    this.description = '';
    this.price = 0;
    this.stock = 0;
    this.file = undefined;
  }
}
