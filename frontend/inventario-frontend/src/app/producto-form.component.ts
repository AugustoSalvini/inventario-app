import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ProductosApi, Producto } from './productos.api';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css'],
})
export class ProductoFormComponent {
  // id del producto si estamos editando
  id?: number;
  loading = false;
  error = '';

  // formulario reactivo para el producto
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ProductosApi,
    public auth: AuthService
  ) {
    // creo el formulario con los campos que tiene la tabla de productos
    this.form = this.fb.group({
      codigo: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      activo: [true],
    });

    // obtengo el id de la ruta (si existe) para saber si es edición
    const rawId = this.route.snapshot.paramMap.get('id');
    this.id = rawId ? Number(rawId) : undefined;

    // si hay id, traigo el producto del backend y completo el formulario
    if (this.id) {
      this.loading = true;
      this.api.show(this.id).subscribe({
        next: (p: Producto) => {
          this.form.patchValue({
            codigo: p.codigo ?? '',
            nombre: p.nombre ?? '',
            descripcion: p.descripcion ?? '',
            precio: p.precio ?? 0,
            stock: p.stock ?? 0,
            activo: p.activo ?? true,
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
    // si el formulario no es válido no hago nada
    if (this.form.invalid) return;
    this.loading = true;

    // preparo el payload asegurando tipos correctos
    const raw = this.form.value;
    const payload = {
      ...raw,
      precio: Number(raw.precio),
      stock: Number(raw.stock),
      activo: !!raw.activo
    } as Partial<Producto>;

    // si hay id actualizo, si no creo un producto nuevo
    const obs = this.id ? this.api.update(this.id, payload)
                        : this.api.create(payload);

    // ejecuto la petición y vuelvo a la lista de productos si sale bien
    obs.subscribe({
      next: () => { this.loading = false; this.router.navigate(['/productos']); },
      error: () => { this.error = this.id ? 'No se pudo actualizar' : 'No se pudo crear el producto'; this.loading = false; }
    });
  }
}
