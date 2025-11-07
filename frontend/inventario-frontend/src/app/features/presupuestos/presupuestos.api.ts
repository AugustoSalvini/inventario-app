import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export type PresupuestoEstado = 'borrador' | 'confirmado' | 'cancelado';

export interface Presupuesto {
  id: number;
  user_id: number;
  cliente_id: number;
  estado: PresupuestoEstado;
  total: number;
  notas?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type PresupuestoPayload = {
  cliente_id: number;
  estado: PresupuestoEstado;
  total: number;
  notas?: string | null;
};

@Injectable({ providedIn: 'root' })
export class PresupuestosApi {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
  }

  list(q = '') {
    const url = `${this.base}/presupuestos${q ? `?q=${encodeURIComponent(q)}` : ''}`;
    return this.http.get<Presupuesto[]>(url, { headers: this.authHeaders() });
    // GET http://127.0.0.1:8000/api/presupuestos
  }

  show(id: number) {
    return this.http.get<Presupuesto>(`${this.base}/presupuestos/${id}`, { headers: this.authHeaders() });
  }

  create(payload: PresupuestoPayload) {
    return this.http.post<Presupuesto>(`${this.base}/presupuestos`, payload, { headers: this.authHeaders() });
  }

  update(id: number, payload: Partial<PresupuestoPayload>) {
    return this.http.put<Presupuesto>(`${this.base}/presupuestos/${id}`, payload, { headers: this.authHeaders() });
  }

  delete(id: number) {
    return this.http.delete(`${this.base}/presupuestos/${id}`, { headers: this.authHeaders() });
  }
}
