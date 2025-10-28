// src/app/producto-form.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ProductosApi, Producto } from './productos.api';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css'],
})
export class ProductoFormComponent {
  id?: number;
  loading = false;
  error = '';

  // ✅ solo se declara acá…
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ProductosApi,
    public auth: AuthService
  ) {
    // …y se inicializa dentro del constructor (evita TS2729)
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
    });

    const rawId = this.route.snapshot.paramMap.get('id');
    this.id = rawId ? Number(rawId) : undefined;

    if (this.id) {
      this.loading = true;
      this.api.get(this.id).subscribe({
        next: (p: Producto) => {
          this.form.patchValue({
            nombre: p.nombre ?? '',
            precio: p.precio ?? 0,
            stock: p.stock ?? 0,
          });
          this.loading = false;
        },
        error: () => {
          this.error = 'No se pudo cargar el producto';
          this.loading = false;
        },
      });
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    const payload = this.form.value as Partial<Producto>;

    const obs = this.id
      ? this.api.update(this.id, payload)
      : this.api.create(payload);

    obs.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/productos']);
      },
      error: () => {
        this.error = this.id ? 'No se pudo actualizar' : 'No se pudo crear';
        this.loading = false;
      },
    });
  }
}
