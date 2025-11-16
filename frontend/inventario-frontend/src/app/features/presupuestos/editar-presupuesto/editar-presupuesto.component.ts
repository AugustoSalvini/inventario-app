// src/app/features/presupuestos/editar-presupuesto/editar-presupuesto.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormArray,
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  PresupuestosApi,
  Presupuesto,
  PresupuestoPayload,
  PresupuestoItem,
} from '../presupuestos.api';
import { AuthService } from '../../../core/services/auth.service';
import { ProductosApi, Producto } from '../../../productos.api';

type PresupuestoEstado =
  | 'borrador'
  | 'enviado'
  | 'aceptado'
  | 'rechazado'
  | 'vencido';

@Component({
  selector: 'app-editar-presupuesto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-presupuesto.component.html',
  styleUrls: ['./editar-presupuesto.component.css'],
})
export class EditarPresupuestoComponent {
  id?: number;
  saving = false;
  error = '';

  form: FormGroup;

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: PresupuestosApi,
    public auth: AuthService,
    private productosApi: ProductosApi
  ) {
    this.form = this.fb.group({
      cliente_id: [null],
      estado: ['borrador'], // 👉 pero no se usa si es user
      notas: [''],
      items: this.fb.array([
        this.itemGroup({ cantidad: 1, precio_unitario: 0 }),
      ]),
    });

    const rawId = this.route.snapshot.paramMap.get('id');
    this.id = rawId ? Number(rawId) : undefined;

    if (this.id) {
      this.api.show(this.id).subscribe({
        next: (p: Presupuesto) => {
          this.form.patchValue({
            cliente_id: this.auth.isUser() ? 1 : p.cliente_id,
            estado: this.auth.isUser() ? 'borrador' : p.estado,
            notas: p.notas ?? '',
          });

          this.items.clear();
          const fromBack = p.items ?? [];
          if (fromBack.length) {
            fromBack.forEach((it) => this.items.push(this.itemGroup(it)));
          } else {
            this.items.push(
              this.itemGroup({ cantidad: 1, precio_unitario: 0 })
            );
          }
        },
        error: () =>
          (this.error = 'No se pudo cargar el presupuesto'),
      });
    }
  }

  private itemGroup(it: Partial<PresupuestoItem>) {
    return this.fb.group({
      producto_id: [it.producto_id ?? null],
      descripcion: [it.descripcion ?? null],
      cantidad: [
        it.cantidad ?? 1,
        [Validators.required, Validators.min(0.01)],
      ],
      precio_unitario: [
        it.precio_unitario ?? 0,
        [Validators.required, Validators.min(0)],
      ],
    });
  }

  private toNum(val: unknown): number {
    return Number(
      String(val ?? '')
        .toString()
        .replace(',', '.')
        .trim()
    );
  }

  addItem() {
    this.items.push(this.itemGroup({ cantidad: 1, precio_unitario: 0 }));
  }

  removeItem(i: number) {
    this.items.removeAt(i);
  }

  // 🔍 Autocompletar usando el ID de producto
  autoCompletarPorId(index: number) {
    const group = this.items.at(index) as FormGroup;
    const rawId = group.get('producto_id')?.value;

    const id = Number(rawId);
    if (!id || Number.isNaN(id)) return;

    this.productosApi.list(String(id)).subscribe({
      next: (productos: Producto[]) => {
        const prod = productos.find((p) => p.id === id) || productos[0];
        if (!prod) return;

        group.patchValue({
          descripcion: prod.nombre,
          precio_unitario: prod.precio,
        });
      },
      error: () => {
        console.warn('No se pudo autocompletar el producto por ID');
      },
    });
  }

  // 🔍 Autocompletar usando el nombre (descripcion)
  autoCompletarPorNombre(index: number) {
    const group = this.items.at(index) as FormGroup;
    const nombre = (group.get('descripcion')?.value || '')
      .toString()
      .trim();

    if (!nombre) return;

    this.productosApi.list(nombre).subscribe({
      next: (productos: Producto[]) => {
        const prod = productos[0];
        if (!prod) return;

        group.patchValue({
          producto_id: prod.id,
          descripcion: prod.nombre,
          precio_unitario: prod.precio,
        });
      },
      error: () => {
        console.warn('No se pudo autocompletar el producto por nombre');
      },
    });
  }

  // 🔢 Total en vivo del presupuesto
  getTotal(): number {
    let total = 0;
    this.items.controls.forEach((ctrl) => {
      const g = ctrl as FormGroup;
      const cant = this.toNum(g.get('cantidad')?.value);
      const precio = this.toNum(g.get('precio_unitario')?.value);
      if (!Number.isNaN(cant) && !Number.isNaN(precio)) {
        total += cant * precio;
      }
    });
    return total;
  }

  save() {
    if (this.form.invalid) {
      this.error = 'Completá todos los campos requeridos.';
      return;
    }

    this.saving = true;
    this.error = '';

    const v: any = this.form.value;
    const rawItems = v.items ?? [];

    const items: PresupuestoItem[] = rawItems.map((it: any) => ({
      producto_id: it.producto_id ? Number(it.producto_id) : null,
      descripcion: (it.descripcion ?? '').trim() || null,
      cantidad: this.toNum(it.cantidad),
      precio_unitario: this.toNum(it.precio_unitario),
    }));

    const clienteId = this.auth.isUser()
      ? 1 // 👈 cliente genérico para user (lo podés cambiar)
      : this.toNum(v.cliente_id);

    const estado: PresupuestoEstado = this.auth.isUser()
      ? 'borrador'
      : (v.estado as PresupuestoEstado);

    const payload: PresupuestoPayload = {
      cliente_id: clienteId,
      estado,
      notas: (v.notas ?? '').trim() || null,
      items,
    };

    const req = this.id
      ? this.api.update(this.id!, payload)
      : this.api.create(payload);

    req.subscribe({
      next: () => {
        this.saving = false;
        const next = this.auth.isUser()
          ? '/productos'
          : '/presupuestos';
        this.router.navigate([next]);
      },
      error: (err) => {
        this.saving = false;
        this.error =
          err?.error?.message ||
          'No se pudo guardar el presupuesto. Verificá los datos.';
        console.error('Error guardando presupuesto:', err?.error);
      },
    });
  }

  cancel() {
    this.router.navigate([
      this.auth.isUser() ? '/productos' : '/presupuestos',
    ]);
  }
}
