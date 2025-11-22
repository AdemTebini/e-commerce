import { Component } from '@angular/core';
import { ApiService } from '../../../services/api';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './add.html',
  styleUrls: ['./add.css']
})
export class AddComponent {

  title = '';
  description = '';
  price = 0;
  stock = 0;

  files: File[] = [];
  imagePreviews: string[] = [];

  msg = '';
  err = '';

  constructor(private api: ApiService) {}

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const fileList = input.files;
    this.msg = '';

    if (fileList && fileList.length > 0) {
      // Add new files to existing array
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        this.files.push(file);

        // Create image preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreviews.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }

    // Reset input to allow selecting same file again
    input.value = '';
  }

  removeImage(index: number) {
    this.files.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  async addProduct() {
    try {
      this.msg = 'Processing...';

      const filenames: string[] = [];

      // upload all images
      for (const file of this.files) {
        const uploadResponse: any = await firstValueFrom(this.api.uploadImage(file));
        if (uploadResponse?.filename) {
          filenames.push(uploadResponse.filename);
        }
      }

      // create product
      const payload = {
        title: this.title,
        description: this.description,
        price: this.price,
        stock: this.stock,
        main_image: filenames[0] || null,
        images: filenames.length > 1 ? filenames.slice(1) : []
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
    this.files = [];
    this.imagePreviews = [];
  }
}
