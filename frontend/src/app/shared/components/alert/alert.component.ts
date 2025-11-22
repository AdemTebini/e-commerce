import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type AlertType = 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() message = '';
  @Input() dismissible = false;

  isVisible = true;

  dismiss(): void {
    if (this.dismissible) {
      this.isVisible = false;
    }
  }
}
