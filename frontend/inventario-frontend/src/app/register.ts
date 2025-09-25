import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  password_confirmation = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  async submit() {
    this.error = '';
    if (this.password !== this.password_confirmation) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }
    this.loading = true;
    try {
      await this.auth.register({
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation,
      });
      this.router.navigateByUrl('/login');
    } catch (e: any) {
      this.error = e?.error?.message || 'Error al registrarse';
    } finally {
      this.loading = false;
    }
  }
}
