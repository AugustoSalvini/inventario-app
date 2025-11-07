// src/app/features/presupuestos/editar-presupuesto/editar-presupuesto.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { PresupuestosApi, PresupuestoPayload, PresupuestoEstado } from '../presupuestos.api';

@Component({
  selector: 'app-editar-presupuesto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-presupuesto.component.html',
  styleUrls: ['./editar-presupuesto.component.css'],   // <- CSS
  })
  export class EditarPresupuestoComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error = '';
  id: number | null = null; // si lo usás para edición

  constructor(
    private fb: FormBuilder,
    private api: PresupuestosApi,
    private router: Router
  ) {
    // ✅ Crear el form DESPUÉS de tener fb inyectado
    this.form = this.fb.nonNullable.group({
      cliente_id: [0,  [Validators.required, Validators.min(1)]],
      total:      [0,  [Validators.required, Validators.min(0)]],
      estado:     ['borrador' as PresupuestoEstado, [Validators.required]],
      notas:      [''],
    });
  }

  ngOnInit(): void {
    // si estás editando, acá cargarías el presupuesto y harías this.form.reset(...)
  }

  save(): void {
    if (this.form.invalid) return;

    const v = this.form.getRawValue();
    const payload: PresupuestoPayload = {
      cliente_id: Number(v.cliente_id),
      total: Number(v.total),
      estado: v.estado as PresupuestoEstado,
      notas: (v.notas || '').trim() || null,
    };

    this.loading = true;
    const obs = this.id ? this.api.update(this.id, payload) : this.api.create(payload);
    obs.subscribe({
      next: () => { this.loading = false; this.router.navigate(['/presupuestos']); },
      error: () => { this.loading = false; this.error = 'No se pudo guardar el presupuesto'; },
    });
  }

  cancel(): void { this.router.navigate(['/presupuestos']); }
}
