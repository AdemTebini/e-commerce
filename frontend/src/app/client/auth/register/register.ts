import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  msg = '';
  err = '';
  loading = false;
  showPassword = false;
  passwordStrength = 0;

  constructor(private http: HttpClient, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  ngDoCheck() {
    this.calculatePasswordStrength();
  }

  calculatePasswordStrength() {
    if (!this.password) {
      this.passwordStrength = 0;
      return;
    }

    let strength = 0;
    if (this.password.length >= 6) strength += 25;
    if (this.password.length >= 10) strength += 25;
    if (/[a-z]/.test(this.password) && /[A-Z]/.test(this.password)) strength += 25;
    if (/[0-9]/.test(this.password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(this.password)) strength += 10;

    this.passwordStrength = Math.min(strength, 100);
  }

  getStrengthLevel(): string {
    if (this.passwordStrength < 30) return 'weak';
    if (this.passwordStrength < 60) return 'medium';
    return 'strong';
  }

  getStrengthText(): string {
    if (this.passwordStrength < 30) return 'Faible';
    if (this.passwordStrength < 60) return 'Moyen';
    return 'Fort';
  }

  submit(): void {
    if (this.loading) return;

    this.err = '';
    this.msg = '';
    this.loading = true;

    const apiUrl = 'http://localhost/ecommerce/backend/public/api/register.php';
    const payload = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.http.post(apiUrl, payload).subscribe({
      next: () => {
        this.loading = false;
        this.msg = 'Compte créé avec succès!';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (e) => {
        this.loading = false;
        this.err = e.error?.error || 'Erreur lors de la création du compte';
      }
    });
  }
}
