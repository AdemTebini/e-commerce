import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toasts" 
           class="toast toast-{{toast.type}}"
           [@slideIn]>
        <div class="toast-icon">
          <span *ngIf="toast.type === 'success'">✓</span>
          <span *ngIf="toast.type === 'error'">✕</span>
          <span *ngIf="toast.type === 'info'">ℹ</span>
          <span *ngIf="toast.type === 'warning'">⚠</span>
        </div>
        <div class="toast-message">{{ toast.message }}</div>
        <button class="toast-close" (click)="close(toast.id)">×</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 420px;
      width: 100%;
      pointer-events: none;
    }

    .toast {
      background: white;
      border-radius: 12px;
      padding: 1rem 1.25rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      gap: 0.875rem;
      border-left: 4px solid;
      pointer-events: all;
      animation: slideInRight 0.3s ease-out, fadeIn 0.3s ease-out;
      transition: all 0.3s ease;
    }

    .toast:hover {
      transform: translateX(-4px);
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
    }

    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .toast-success {
      border-left-color: #16a34a;
      background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
    }

    .toast-error {
      border-left-color: #dc2626;
      background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
    }

    .toast-info {
      border-left-color: #9333ea;
      background: linear-gradient(135deg, #faf5ff 0%, #ffffff 100%);
    }

    .toast-warning {
      border-left-color: #f6c343;
      background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
    }

    .toast-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      font-size: 1.125rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .toast-success .toast-icon {
      background: #16a34a;
      color: white;
    }

    .toast-error .toast-icon {
      background: #dc2626;
      color: white;
    }

    .toast-info .toast-icon {
      background: #9333ea;
      color: white;
    }

    .toast-warning .toast-icon {
      background: #f6c343;
      color: #1f2937;
    }

    .toast-message {
      flex: 1;
      font-size: 0.95rem;
      font-weight: 500;
      color: #1f2937;
      line-height: 1.4;
    }

    .toast-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #6b7280;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .toast-close:hover {
      background: rgba(0, 0, 0, 0.1);
      color: #1f2937;
    }

    @media (max-width: 768px) {
      .toast-container {
        top: 4rem;
        right: 1rem;
        left: 1rem;
        max-width: none;
      }

      .toast {
        padding: 0.875rem 1rem;
      }

      .toast-icon {
        width: 28px;
        height: 28px;
        font-size: 1rem;
      }

      .toast-message {
        font-size: 0.9rem;
      }
    }
  `]
})
export class ToastContainerComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.getToasts().subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  close(id: number) {
    this.toastService.remove(id);
  }
}
