import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

export interface Producto {
  id: number;
  codigo?: string | null;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  stock: number;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export type ProductoPayload = Partial<Producto>;

@Injectable({ providedIn: 'root' })
export class ProductosApi {
  private base = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) {}

  list(q = ''): Observable<Producto[]> {
    const url = q ? `${this.base}/productos?q=${encodeURIComponent(q)}` : `${this.base}/productos`;
    return this.http.get<Producto[]>(url);
  }

  show(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.base}/productos/${id}`);
  }

  create(payload: ProductoPayload): Observable<Producto> {
    return this.http.post<Producto>(`${this.base}/productos`, payload);
  }

  update(id: number, payload: ProductoPayload): Observable<Producto> {
    return this.http.put<Producto>(`${this.base}/productos/${id}`, payload);
  }

  updateStock(id: number, stock: number): Observable<Producto> {
    return this.http.patch<Producto>(`${this.base}/productos/${id}/stock`, { stock });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.base}/productos/${id}`);
  }
}
