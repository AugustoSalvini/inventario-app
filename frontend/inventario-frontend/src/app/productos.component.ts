import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ProductosApi, Producto } from './productos.api';
import { Router } from '@angular/router';

// Si ya tenés un AuthService con roleIn(), importalo en vez de este stub
class AuthStub {
  token: string | null = localStorage.getItem('token');
  role: string | null = localStorage.getItem('role');
  roleIn(arr: string[]) { return !!this.role && arr.includes(this.role!); }
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html'
})
export class ProductosComponent implements OnInit {
  q = '';
  loading = false;
  data: Producto[] = [];
  auth = new AuthStub();

  constructor(private api: ProductosApi, private router: Router) {}

  async ngOnInit() { await this.fetch(); }

  async fetch() {
    this.loading = true;
    try {
      const res = await firstValueFrom(this.api.list(this.q || undefined));
      this.data = res.data ?? [];
    } finally {
      this.loading = false;
    }
  }

  nuevo() { this.router.navigate(['/productos/nuevo']); }
  editar(p: Producto) { this.router.navigate(['/productos', p.id, 'editar']); }

  async eliminar(p: Producto) {
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    await firstValueFrom(this.api.remove(p.id!));
    this.data = this.data.filter(x => x.id !== p.id);
  }

  async actualizarStock(p: Producto) {
    const nuevo = Number(prompt(`Stock actual: ${p.stock}\nNuevo stock:`));
    if (Number.isNaN(nuevo)) return;
    const res = await firstValueFrom(this.api.updateStock(p.id!, nuevo));
    p.stock = res.data.stock;
    alert('Stock actualizado');
  }
}
