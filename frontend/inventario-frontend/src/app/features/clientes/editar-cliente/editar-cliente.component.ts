// src/app/features/clientes/editar-cliente/editar-cliente.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// importa tu servicio real:
// import { ClientesApi, Cliente } from '../../clientes.api';

@Component({
  selector: 'app-editar-cliente',
  standalone: true,
  // Si no usás enlaces en el HTML, no importes RouterLink para evitar el warning
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.css'],
})
export class EditarClienteComponent {
  form!: FormGroup;

  id?: number;
  loading = false;  // para “Cargando…”
  saving = false;   // <— agrega esta línea; la usa el template en [disabled]
  error = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    // private api: ClientesApi
  ) {
    // inicializá el form dentro del constructor (evita TS2729)
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.email]],
      telefono: [''],
      direccion: [''],
      cuit: [''],
    });

    const rawId = this.route.snapshot.paramMap.get('id');
    this.id = rawId ? Number(rawId) : undefined;

    // Si estás editando, podés cargar datos (descomentar cuando tengas la API)
    // if (this.id) {
    //   this.loading = true;
    //   this.api.show(this.id).subscribe({
    //     next: (c: Cliente) => {
    //       this.form.patchValue({
    //         nombre: c.nombre ?? '',
    //         email: c.email ?? '',
    //         telefono: c.telefono ?? '',
    //         direccion: c.direccion ?? '',
    //         cuit: c.cuit ?? '',
    //       });
    //       this.loading = false;
    //     },
    //     error: () => { this.error = 'No se pudo cargar el cliente'; this.loading = false; }
    //   });
    // }
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;     // <— usa saving aquí
    this.error = '';

    // const payload = this.form.getRawValue() as Partial<Cliente>;
    // const obs = this.id ? this.api.update(this.id, payload) : this.api.create(payload);
    // obs.subscribe({
    //   next: () => { this.saving = false; this.router.navigate(['/clientes']); },
    //   error: () => { this.saving = false; this.error = 'No se pudo guardar'; }
    // });

    // Mientras definís la API, simulamos el flujo para que compile y puedas seguir:
    setTimeout(() => { this.saving = false; /* this.router.navigate(['/clientes']); */ }, 300);
  }
}
