import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminHeaderComponent } from './admin/admin-header/admin-header.component';
import { AdminSideNavComponent } from './admin/admin-side-nav/admin-side-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AdminHeaderComponent, AdminSideNavComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
