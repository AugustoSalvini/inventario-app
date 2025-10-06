import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';

export interface Producto {
  id?: number;
  codigo?: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  activo?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductosApi {
  private api = environment.apiUrl + '/productos';
  constructor(private http: HttpClient) {}

  list(q?: string) {
    const params = q ? new HttpParams().set('q', q) : undefined;
    return this.http.get<{ ok: boolean; data: Producto[] }>(this.api, { params });
  }
  get(id: number) {
    return this.http.get<{ ok: boolean; data: Producto }>(`${this.api}/${id}`);
  }
  create(body: Producto) {
    return this.http.post<{ ok: boolean; data: Producto }>(this.api, body);
  }
  update(id: number, body: Partial<Producto>) {
    return this.http.put<{ ok: boolean; data: Producto }>(`${this.api}/${id}`, body);
  }
  updateStock(id: number, stock: number) {
    return this.http.patch<{ ok: boolean; data: Producto }>(`${this.api}/${id}/stock`, { stock });
  }
  remove(id: number) {
    return this.http.delete<{ ok: boolean; message: string }>(`${this.api}/${id}`);
  }
}
