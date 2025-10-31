import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PresupuestosApi, Presupuesto } from '../presupuestos.api';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-editar-presupuesto',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-presupuesto.component.html',
})
export class EditarPresupuestoComponent {
  id?: number;
  loading = false;
  error = '';

  // Declaración (se inicializa en el constructor)
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: PresupuestosApi,
    public auth: AuthService
  ) {
    // ✅ Inicialización AQUÍ (evita TS2729)
    this.form = this.fb.nonNullable.group({
      cliente_id: [0,  [Validators.required, Validators.min(1)]],
      total:      [0,  [Validators.required, Validators.min(0)]],
      estado:     ['borrador', [Validators.required]],
      notas:      [''],
    });

    const rawId = this.route.snapshot.paramMap.get('id');
    this.id = rawId ? Number(rawId) : undefined;

    if (this.id) {
      this.loading = true;
      this.api.show(this.id).subscribe({
        next: (p: Presupuesto) => {
          this.form.patchValue({
            cliente_id: p.cliente_id ?? 0,
            total:      p.total ?? 0,
            estado:     p.estado ?? 'borrador',
            notas:      p.notas ?? '',
          }, { emitEvent: false });
          this.loading = false;
        },
        error: () => { this.error = 'No se pudo cargar el presupuesto'; this.loading = false; },
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    const v = this.form.getRawValue();
    const payload: Partial<Presupuesto> = {
      cliente_id: Number(v.cliente_id ?? 0),
      total:      Number(v.total ?? 0),
      estado:     v.estado ?? 'borrador',
      notas:      v.notas ?? '',
    };

    const obs = this.id ? this.api.update(this.id, payload) : this.api.create(payload);

    obs.subscribe({
      next: () => { this.loading = false; this.router.navigate(['/presupuestos']); },
      error: () => { this.error = 'No se pudo guardar'; this.loading = false; },
    });
  }
}
