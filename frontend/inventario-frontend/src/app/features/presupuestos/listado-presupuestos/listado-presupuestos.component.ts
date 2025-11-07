import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PresupuestosApi, Presupuesto } from '../presupuestos.api';

@Component({
  selector: 'app-listado-presupuestos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './listado-presupuestos.component.html',
  styleUrls: ['./listado-presupuestos.component.css'], // <- CSS
})

export class ListadoPresupuestosComponent implements OnInit {
  data: Presupuesto[] = [];
  q = '';
  loading = false;
  error = '';

  constructor(private api: PresupuestosApi) {}

  ngOnInit(): void { this.fetch(); }

  fetch(): void {
    this.loading = true;
    this.error = '';
    this.api.list(this.q).subscribe({
      next: rows => { this.data = rows; this.loading = false; },
      error: () => { this.error = 'No se pudieron cargar los presupuestos'; this.loading = false; },
    });
  }

  buscar(): void { this.fetch(); }
}
