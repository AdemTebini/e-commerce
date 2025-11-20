import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit.html',
  styleUrls: ['./edit.css']
})
export class EditComponent implements OnInit {
  id!: number;
  title = ''; description = ''; price = 0; stock = 0;
  file?: File;
  currentImage?: string;
  msg = ''; err = '';

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  get currentImageUrl() {
    return this.api.buildImageUrl(this.currentImage || null);
  }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.id) {
      this.err = 'Invalid product id';
      return;
    }
    this.loadProduct();
  }

  private loadProduct() {
    this.api.getProduct(this.id).subscribe({
      next: (product: any) => {
        this.title = product?.title || '';
        this.description = product?.description || '';
        this.price = product?.price || 0;
        this.stock = product?.stock || 0;
        this.currentImage = product?.image || product?.main_image || undefined;
        this.err = '';
      },
      error: () => {
        this.err = 'Failed to load product';
      }
    });
  }

  onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    this.file = file || undefined;
    this.msg = '';
  }

  async save() {
    if (!this.id) { return; }
    this.msg = 'Saving...';
    this.err = '';
    try {
      let filename = this.currentImage || null;
      if (this.file) {
        const uploadResponse: any = await firstValueFrom(this.api.uploadImage(this.file));
        filename = uploadResponse?.filename || filename;
      }
      const payload = { title: this.title, description: this.description, price: this.price, stock: this.stock, image: filename };
      await firstValueFrom(this.api.updateProduct(this.id, payload));
      this.msg = 'Saved successfully';
      this.currentImage = filename || undefined;
      this.file = undefined;
      setTimeout(()=> this.router.navigate(['/admin/products']), 800);
    } catch (e:any) {
      this.err = e?.error?.error || e.message || 'Save failed';
      this.msg = '';
    }
  }

  cancel() {
    this.router.navigate(['/admin/products']);
  }
}
