import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  loading = false;
  error = '';
  message = '';
  form!: FormGroup;  // <- declaramos y lo inicializamos en el constructor

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
      // no mandamos 'rol'; backend deja 'usuario' por defecto
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true; this.error = ''; this.message = '';
    this.auth.register(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Usuario registrado. Ahora podés iniciar sesión.';
        setTimeout(() => this.router.navigate(['/login']), 900);
      },
      error: e => {
        this.loading = false;
        this.error = e?.error?.message || 'No se pudo registrar';
      }
    });
  }
}
