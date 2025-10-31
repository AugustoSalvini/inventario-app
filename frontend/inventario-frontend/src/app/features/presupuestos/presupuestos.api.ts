import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Presupuesto {
  id: number;
  cliente_id: number;
  total: number;
  estado?: string; // borrador | enviado | aceptado
  notas?: string;
}

@Injectable({ providedIn: 'root' })
export class PresupuestosApi {
  private base = `${environment.apiBaseUrl}/presupuestos`;
  constructor(private http: HttpClient) {}

  list(q=''){ return this.http.get<Presupuesto[]>(`${this.base}?q=${encodeURIComponent(q)}`); }
  show(id:number){ return this.http.get<Presupuesto>(`${this.base}/${id}`); }
  create(data: Partial<Presupuesto>){ return this.http.post<Presupuesto>(this.base, data); }
  update(id:number, data: Partial<Presupuesto>){ return this.http.put<Presupuesto>(`${this.base}/${id}`, data); }
  delete(id:number){ return this.http.delete(`${this.base}/${id}`); }
}
