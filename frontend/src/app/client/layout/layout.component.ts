import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastContainerComponent } from '../../shared/components/toast-container.component';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, ToastContainerComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class ClientLayoutComponent {}
