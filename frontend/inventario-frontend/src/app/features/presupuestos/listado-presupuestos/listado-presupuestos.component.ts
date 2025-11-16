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
  // ✅ hacemos q reactivo sin tocar el HTML
  private _q = '';
  get q(): string { return this._q; }
  set q(value: string) {
    this._q = value ?? '';
    // debounce suave para no recalcular por cada tecla
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.applySearch(this._q);
    }, 200);
  }

  data: Presupuesto[] = [];
  allData: Presupuesto[] = []; // lista completa para restaurar al borrar
  loading = false;
  error = '';
  private debounceTimer: any;

  constructor(
    private api: PresupuestosApi,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

  /** Carga todos los presupuestos (sin filtro en el back) */
  fetch(): void {
    this.loading = true;
    this.api.list('' /* siempre sin q para evitar 500 */).subscribe({
      next: (res) => {
        this.allData = res.data || [];
        // si hay término ya tipeado, lo aplicamos; si no, mostramos todo
        this.applySearch(this._q);
        this.loading = false;
        this.error = '';
      },
      error: () => {
        this.error = 'No se pudieron cargar los presupuestos';
        this.loading = false;
      }
    });
  }

  /** Click en “Buscar” o Enter: fuerza aplicar el término actual */
  buscar(): void {
    this.applySearch(this._q);
  }

  /** Aplica búsqueda o restaura la lista completa */
  private applySearch(value: string): void {
    const term = (value || '').trim();
    if (term === '') {
      this.data = [...this.allData];
    } else {
      this.data = this.localFilter(this.allData, term);
    }
  }

  /** Filtro local: por id, cliente, estado o total (sin tildes, case-insensitive) */
  private localFilter(rows: Presupuesto[], term: string): Presupuesto[] {
    const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const t = normalize(term.trim().toLowerCase());
    const idNum = Number(t);
    const isNumeric = !isNaN(idNum);

    return rows.filter(p => {
      const byId = isNumeric && p.id === idNum;
      const clienteNombre = normalize(p.cliente?.nombre || '').toLowerCase();
      const byCliente = clienteNombre.includes(t);
      const byEstado = normalize(p.estado || '').toLowerCase().includes(t);
      const byTotal = (p.total ?? '').toString().toLowerCase().includes(t);
      return byId || byCliente || byEstado || byTotal;
    });
  }

  /** Acciones */
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
