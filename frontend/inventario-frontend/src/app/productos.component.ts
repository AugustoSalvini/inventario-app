import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './core/services/auth.service';
import { ProductosApi, Producto } from './productos.api';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent implements OnInit {
  data: Producto[] = [];
  q = '';
  loading = false;
  error = '';

  constructor(
    public auth: AuthService,
    private api: ProductosApi,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    this.loading = true;
    this.error = '';
    this.api.list(this.q).subscribe({
      next: (items) => {
        this.data = items;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los productos';
        this.loading = false;
      },
    });
  }

  buscar(): void {
    this.fetch();
  }

  nuevo(): void {
    this.router.navigate(['/productos/nuevo']);
  }

  editar(p: Producto): void {
    this.router.navigate(['/productos', p.id, 'editar']);
  }

  eliminar(p: Producto): void {
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    this.api.delete(p.id).subscribe({
      next: () => this.fetch(),
      error: () => (this.error = 'No se pudo eliminar el producto'),
    });
  }

  actualizarStock(p: Producto): void {
    const val = prompt(`Nuevo stock para "${p.nombre}"`, String(p.stock ?? 0));
    if (val == null) return;
    const nuevo = Number(val);
    if (Number.isNaN(nuevo) || nuevo < 0) return;

    this.api.updateStock(p.id, nuevo).subscribe({
      next: () => this.fetch(),
      error: () => (this.error = 'No se pudo actualizar el stock'),
    });
  }

  // ✅ Nuevo método para cerrar sesión
  logout(): void {
    this.auth.logout();
  }
}
