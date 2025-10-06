import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
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
      // Convertimos el Observable en Promise
      const res = await firstValueFrom(
        this.auth.login({ email: this.email, password: this.password })
      );

      // Guardamos el token para que lo lea el interceptor
      this.auth.token = res.access_token;

      // Navegamos (ajustá la ruta si querés ir a otra)
      this.router.navigateByUrl('/');
    } catch (e: any) {
      this.error = e?.error?.message || 'Error al iniciar sesión';
    } finally {
      this.loading = false;
    }
  }
}
