import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Login</h2>
    <form (ngSubmit)="submit()">
      <input [(ngModel)]="email" name="email" placeholder="Email"><br>
      <input [(ngModel)]="password" name="password" type="password" placeholder="Password"><br>
      <button type="submit">Login</button>
    </form>
    <p style="color:red">{{err}}</p>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  err = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.err = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (e) => this.err = e.error?.error || 'Login failed'
    });
  }
}
