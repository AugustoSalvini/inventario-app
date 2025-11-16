import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from './core/services/auth.service'; // ✅ RUTA CORRECTA
import { ProductosApi, Producto } from './productos.api';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DecimalPipe, RouterModule],
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

  /** Crear producto → SOLO ADMIN */
  nuevo(): void {
    if (this.auth.getRole() !== 'admin') return;
    this.editingId = null;
    this.form.reset({ codigo: '', nombre: '', descripcion: '', precio: 0, stock: 0, activo: true });
    this.showForm = true;
  }

  /** Editar producto → ADMIN + EMPLEADO ✅ */
  editar(p: Producto): void {
    // 🔁 CAMBIO: antes chequeaba solo admin, ahora usamos canEdit()
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

  /** 🔧 Normaliza los valores numéricos (quita separadores de miles, corrige comas) */
  private parseDecimal(x: any): number {
    return Number(String(x).replace(/\./g, '').replace(',', '.'));
  }

  /** Guardar (crear/actualizar) */
  submit(): void {
    if (this.form.invalid) return;

    const role = this.auth.getRole();
    const isEdit = this.editingId !== null;

    // ✅ Crear: SOLO admin
    if (!isEdit && role !== 'admin') return;

    // ✅ Editar: admin + empleado
    if (isEdit && !this.auth.canEdit()) return;

    this.loading = true;
    this.error = '';

    const v = this.form.getRawValue();
    const payload = {
      codigo:      v.codigo?.trim() || null,
      nombre:      v.nombre.trim(),
      descripcion: (v.descripcion || '').trim() || null,
      precio:      this.parseDecimal(v.precio),
      stock:       Number(v.stock),
      activo:      !!v.activo,
    };

    const obs = this.editingId
      ? this.api.update(this.editingId, payload)
      : this.api.create(payload);

    obs.subscribe({
      next: () => {
        this.loading = false;
        this.showForm = false;
        this.editingId = null;
        this.fetch();
      },
      error: (err) => {
        this.loading = false;

        const be = err?.error;
        if (be?.errors) {
          const first = Object.values(be.errors)[0] as string[];
          this.error = first?.[0] || 'Error al guardar el producto';
        } else if (be?.message) {
          this.error = be.message;
        } else {
          this.error = this.editingId
            ? 'No se pudo actualizar el producto'
            : 'No se pudo crear el producto';
        }
      },
    });
  }

  /** Eliminar → SOLO ADMIN */
  eliminar(p: Producto): void {
    if (!this.auth.canDelete()) return;
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    this.api.delete(p.id).subscribe({
      next: () => this.fetch(),
      error: () => (this.error = 'No se pudo eliminar el producto'),
    });
  }

  /** Actualizar stock → ADMIN o EMPLEADO */
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
