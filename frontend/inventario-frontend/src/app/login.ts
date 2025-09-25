import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  async submit() {
    this.error = '';
    this.loading = true;
    try {
      // 👇 tu AuthService espera un objeto, no dos strings
      await this.auth.login({ email: this.email, password: this.password });
      this.router.navigateByUrl('/'); // o a donde quieras ir
    } catch (e: any) {
      this.error = e?.error?.message || 'Error al iniciar sesión';
    } finally {
      this.loading = false;
    }
  }
}
