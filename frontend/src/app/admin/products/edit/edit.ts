import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './edit.html',
  styleUrls: ['./edit.css']
})
export class EditComponent implements OnInit {
  id!: number;
  title = ''; description = ''; price = 0; stock = 0;
  
  currentImages: string[] = [];
  currentImageFilenames: string[] = [];
  
  newFiles: File[] = [];
  newImagePreviews: string[] = [];
  
  msg = ''; err = '';

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

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
        
        // Load existing images
        const baseUrl = 'http://localhost/ecommerce/backend/public/uploads/';
        this.currentImages = [];
        this.currentImageFilenames = [];
        
        if (product?.main_image) {
          this.currentImages.push(baseUrl + product.main_image);
          this.currentImageFilenames.push(product.main_image);
        }
        
        if (product?.images && Array.isArray(product.images)) {
          product.images.forEach((img: string) => {
            if (img) {
              this.currentImages.push(baseUrl + img);
              this.currentImageFilenames.push(img);
            }
          });
        }
        
        this.err = '';
      },
      error: () => {
        this.err = 'Failed to load product';
      }
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const fileList = input.files;
    this.msg = '';

    if (fileList && fileList.length > 0) {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        this.newFiles.push(file);

        const reader = new FileReader();
        reader.onload = (e) => {
          this.newImagePreviews.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }

    input.value = '';
  }

  removeCurrentImage(index: number) {
    this.currentImages.splice(index, 1);
    this.currentImageFilenames.splice(index, 1);
  }

  removeNewImage(index: number) {
    this.newFiles.splice(index, 1);
    this.newImagePreviews.splice(index, 1);
  }

  async save() {
    if (!this.id) { return; }
    this.msg = 'Saving...';
    this.err = '';
    try {
      // Upload new images
      const newFilenames: string[] = [];
      for (const file of this.newFiles) {
        const uploadResponse: any = await firstValueFrom(this.api.uploadImage(file));
        if (uploadResponse?.filename) {
          newFilenames.push(uploadResponse.filename);
        }
      }

      // Combine current and new filenames
      const allFilenames = [...this.currentImageFilenames, ...newFilenames];
      
      const payload = { 
        title: this.title, 
        description: this.description, 
        price: this.price, 
        stock: this.stock, 
        main_image: allFilenames[0] || null,
        images: allFilenames.length > 1 ? allFilenames.slice(1) : []
      };
      
      await firstValueFrom(this.api.updateProduct(this.id, payload));
      this.msg = 'Saved successfully';
      
      // Clear new images and refresh
      this.newFiles = [];
      this.newImagePreviews = [];
      
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
