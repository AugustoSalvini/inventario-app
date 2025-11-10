// src/app/features/presupuestos/editar-presupuesto/editar-presupuesto.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PresupuestosApi, Presupuesto, PresupuestoPayload, PresupuestoItem, PresupuestoEstado } from '../presupuestos.api';

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

  get items(): FormArray { return this.form.get('items') as FormArray; }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: PresupuestosApi,
  ) {
    this.form = this.fb.group({
      cliente_id: [null, [Validators.required]],
      estado: ['borrador' as PresupuestoEstado],
      notas: [''],
      items: this.fb.array([]),
    });

    const rawId = this.route.snapshot.paramMap.get('id');
    this.id = rawId ? Number(rawId) : undefined;

    if (this.id) {
      this.api.show(this.id).subscribe({
        next: (p: Presupuesto) => {
          this.form.patchValue({
            cliente_id: p.cliente_id,
            estado: p.estado,
            notas: p.notas ?? '',
          });
          (p.items ?? []).forEach(it => this.items.push(this.itemGroup(it)));
        },
        error: () => this.error = 'No se pudo cargar el presupuesto'
      });
    } else {
      // ítem por defecto
      this.items.push(this.itemGroup({ cantidad: 1, precio_unitario: 0 }));
    }
  }

  private itemGroup(it: Partial<PresupuestoItem>) {
    return this.fb.group({
      producto_id: [it.producto_id ?? null],
      descripcion: [it.descripcion ?? null],
      cantidad:    [it.cantidad ?? 1, [Validators.required, Validators.min(1)]],
      precio_unitario: [it.precio_unitario ?? 0, [Validators.required, Validators.min(0)]],
    });
  }

  addItem() { this.items.push(this.itemGroup({ cantidad: 1, precio_unitario: 0 })); }
  removeItem(i: number) { this.items.removeAt(i); }

  save() {
    if (this.form.invalid) return;
    this.saving = true;
    this.error = '';

    const v = this.form.value;

    const payload: PresupuestoPayload = {
      cliente_id: Number(v.cliente_id),                         // 👈 requerido por backend
      estado: (v.estado as PresupuestoEstado) || 'borrador',
      notas: (v.notas ?? '') || null,
      items: (v.items || []).map((it: any) => ({
        producto_id: it.producto_id ? Number(it.producto_id) : null,
        descripcion: (it.descripcion ?? '') || null,
        cantidad: Number(it.cantidad),
        // normalizamos coma a punto para evitar 422 por string/locale
        precio_unitario: Number(String(it.precio_unitario).toString().replace(',', '.')),
      })),
    };

    const req = this.id ? this.api.update(this.id, payload) : this.api.create(payload);

    req.subscribe({
      next: () => { this.saving = false; this.router.navigate(['/presupuestos']); },
      error: () => { this.saving = false; this.error = 'No se pudo guardar el presupuesto'; },
    });
  }

  cancel() { this.router.navigate(['/presupuestos']); }
}
