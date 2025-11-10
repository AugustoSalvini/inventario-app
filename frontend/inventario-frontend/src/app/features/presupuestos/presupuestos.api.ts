// src/app/features/presupuestos/presupuestos.api.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export type PresupuestoEstado = 'borrador' | 'confirmado' | 'cancelado';

export interface PresupuestoItem {
  id?: number;
  presupuesto_id?: number;
  producto_id?: number | null;
  descripcion?: string | null;
  cantidad: number;
  precio_unitario: number;
  subtotal?: number;
}

export interface ClienteRef {
  id: number;
  nombre: string;
}

export interface Presupuesto {
  id: number;
  user_id: number;
  cliente_id: number;
  cliente?: ClienteRef;
  estado: PresupuestoEstado;
  total: number;
  notas?: string | null;
  created_at?: string;
  items?: PresupuestoItem[];
}

export interface PresupuestoPayload {
  cliente_id: number;
  estado?: PresupuestoEstado;
  notas?: string | null;
  items?: PresupuestoItem[];
}

@Injectable({ providedIn: 'root' })
export class PresupuestosApi {
  private base = `${environment.apiBaseUrl}/presupuestos`;

  constructor(private http: HttpClient) {}

  list(q = '') {
    const url = q ? `${this.base}?q=${encodeURIComponent(q)}` : this.base;
    // Backend devuelve paginate() => { data: Presupuesto[], links, meta }
    return this.http.get<{ data: Presupuesto[] }>(url);
  }

  show(id: number) {
    return this.http.get<Presupuesto>(`${this.base}/${id}`);
  }

  create(payload: PresupuestoPayload) {
    return this.http.post<Presupuesto>(this.base, payload);
  }

  update(id: number, payload: PresupuestoPayload) {
    return this.http.put<Presupuesto>(`${this.base}/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete<{ ok: boolean }>(`${this.base}/${id}`);
  }
}
