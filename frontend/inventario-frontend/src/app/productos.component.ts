import { Component, OnInit } from '@angular/core';
import { ProductsService } from './products.service'; // 👈 Ajusta el path si el archivo está en el mismo folder

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private products: ProductsService) {}

  ngOnInit(): void {
    this.products.getAll().subscribe({
      next: (res: any) => {
        this.productos = res.data ?? res; // guarda la lista
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Error cargando productos';
        this.loading = false;
      }
    });
  }
}
