// src/app/features/presupuestos/listado-presupuestos/listado-presupuestos.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PresupuestosApi, Presupuesto } from '../presupuestos.api';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-listado-presupuestos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DecimalPipe, DatePipe],
  templateUrl: './listado-presupuestos.component.html',
  styleUrls: ['./listado-presupuestos.component.css'],
})
export class ListadoPresupuestosComponent implements OnInit {
  q = '';
  data: Presupuesto[] = [];
  loading = false;
  error = '';

  constructor(
    private api: PresupuestosApi,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void { this.fetch(); }

  fetch(): void {
    this.loading = true;
    this.api.list(this.q).subscribe({
      next: (res) => { this.data = res.data; this.loading = false; },
      error: () => { this.error = 'No se pudieron cargar los presupuestos'; this.loading = false; }
    });
  }

  buscar(): void { this.fetch(); }

  nuevo(): void {
    if (!this.auth.canEdit()) return;
    this.router.navigate(['/presupuestos/nuevo']);
  }

  editar(id: number): void {
    if (!this.auth.canEdit()) return;
    this.router.navigate(['/presupuestos', id, 'editar']);
  }

  eliminar(id: number): void {
    if (!this.auth.canDelete()) return;
    if (!confirm('¿Eliminar presupuesto?')) return;
    this.api.delete(id).subscribe({
      next: () => this.fetch(),
      error: () => this.error = 'No se pudo eliminar el presupuesto'
    });
  }
}
