import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/* Modelo que representa un producto tal como viene del backend */
export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  stock: number;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

/* Estructura usada para crear o editar un producto */
export type ProductPayload = {
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  activo?: boolean;
};

@Injectable({ providedIn: 'root' })
export class ProductosApi {
  private base = `${environment.apiBaseUrl}/productos`;

  constructor(private http: HttpClient) {}

  /* Trae todos los productos, con búsqueda opcional */
  list(q = ''): Observable<Producto[]> {
    const url = q ? `${this.base}?q=${encodeURIComponent(q)}` : this.base;
    return this.http.get<Producto[]>(url);
  }

  /* Obtener un producto específico */
  show(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.base}/${id}`);
  }

  /* Crear un producto nuevo */
  create(payload: ProductPayload): Observable<Producto> {
    return this.http.post<Producto>(this.base, payload);
  }

  /* Actualizar información de un producto */
  update(id: number, payload: Partial<ProductPayload>): Observable<Producto> {
    return this.http.put<Producto>(`${this.base}/${id}`, payload);
  }

  /* Actualizar solo el stock */
  updateStock(id: number, stock: number): Observable<Producto> {
    return this.http.patch<Producto>(`${this.base}/${id}/stock`, { stock });
  }

  /* Eliminar un producto */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
