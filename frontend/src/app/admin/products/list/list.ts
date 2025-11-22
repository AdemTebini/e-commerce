import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api';
import { Router } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class ListComponent implements OnInit {
  products: any[] = [];
  loading = false;
  err = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() { this.load(); }

  imageUrl(filename?: string | null) {
    return this.api.buildImageUrl(filename);
  }

  load() {
    this.loading = true;
    this.api.getProducts().subscribe({
      next: (res: any) => { this.products = res; this.loading = false; },
      error: (e) => { this.err = 'Failed to load'; this.loading = false; }
    });
  }

  goAdd() { this.router.navigate(['/admin/products/add']); }
  goEdit(id: number) { this.router.navigate(['/admin/products/edit', id]); }

  async deleteProduct(id: number) {
    if (!confirm('Delete product?')) return;
    this.api.deleteProduct(id).subscribe({
      next: () => { this.load(); },
      error: () => { alert('Delete failed'); }
    });
  }
}
