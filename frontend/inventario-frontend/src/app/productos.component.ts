import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './core/services/auth.service';
import { ProductosApi, Producto } from './productos.api';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DecimalPipe],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent implements OnInit {
  data: Producto[] = [];
  q = '';
  loading = false;
  error = '';

  showForm = false;
  editingId: number | null = null;
  form!: FormGroup;

  constructor(
    public auth: AuthService,
    private api: ProductosApi,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.nonNullable.group({
      codigo:      [''],
      nombre:      ['', [Validators.required, Validators.maxLength(255)]],
      descripcion: [''],
      precio:      [0,  [Validators.required, Validators.min(0)]],
      stock:       [0,  [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
      activo:      [true],
    });
  }

  ngOnInit(): void { this.fetch(); }

  fetch(): void {
    this.loading = true;
    this.error = '';
    this.api.list(this.q).subscribe({
      next: items => { this.data = items; this.loading = false; },
      error: () => { this.error = 'No se pudieron cargar los productos'; this.loading = false; },
    });
  }

  buscar(): void { this.fetch(); }

  nuevo(): void {
    if (!this.auth.canEdit()) return;
    this.editingId = null;
    this.form.reset({ codigo: '', nombre: '', descripcion: '', precio: 0, stock: 0, activo: true });
    this.showForm = true;
  }

  editar(p: Producto): void {
    if (!this.auth.canEdit()) return;
    this.editingId = p.id;
    this.form.reset({
      codigo:      p.codigo ?? '',
      nombre:      p.nombre,
      descripcion: p.descripcion ?? '',
      precio:      p.precio,
      stock:       p.stock,
      activo:      !!p.activo,
    });
    this.showForm = true;
  }

  cancelarForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.form.reset({ codigo: '', nombre: '', descripcion: '', precio: 0, stock: 0, activo: true });
  }

  submit(): void {
    if (this.form.invalid || !this.auth.canEdit()) return;
    this.loading = true;
    this.error = '';

    const v = this.form.getRawValue();
    const payload = {
      codigo:      v.codigo?.trim() || null,
      nombre:      v.nombre.trim(),
      descripcion: (v.descripcion || '').trim() || null,
      precio:      Number(v.precio),
      stock:       Number(v.stock),
      activo:      !!v.activo,
    };

    const obs = this.editingId
      ? this.api.update(this.editingId, payload)
      : this.api.create(payload);

    obs.subscribe({
      next: () => { this.loading = false; this.showForm = false; this.editingId = null; this.fetch(); },
      error: () => { this.loading = false; this.error = this.editingId ? 'No se pudo actualizar el producto' : 'No se pudo crear el producto'; },
    });
  }

  eliminar(p: Producto): void {
    if (!this.auth.canDelete()) return;
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    this.api.delete(p.id).subscribe({
      next: () => this.fetch(),
      error: () => (this.error = 'No se pudo eliminar el producto'),
    });
  }

  actualizarStock(p: Producto): void {
    if (!this.auth.canEdit()) return;
    const val = prompt(`Nuevo stock para "${p.nombre}"`, String(p.stock ?? 0));
    if (val == null) return;
    const nuevo = Number(val);
    if (Number.isNaN(nuevo) || nuevo < 0) return;

    this.api.updateStock(p.id, nuevo).subscribe({
      next: () => this.fetch(),
      error: () => (this.error = 'No se pudo actualizar el stock'),
    });
  }

  logout(): void { this.auth.logout(); }
}
