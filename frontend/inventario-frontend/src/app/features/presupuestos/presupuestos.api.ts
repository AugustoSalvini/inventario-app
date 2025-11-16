import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/* Representa un ítem dentro del presupuesto */
export interface PresupuestoItem {
  id?: number;
  presupuesto_id?: number;
  producto_id?: number | null;
  descripcion?: string | null;
  cantidad: number;
  precio_unitario: number;
  subtotal?: number;
}

/* Modelo principal del presupuesto */
export interface Presupuesto {
  id: number;
  cliente_id: number | null;
  estado: string;
  total: number;
  notas: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;

  /* Datos del cliente asociado */
  cliente?: {
    id: number;
    nombre: string;
  };

  /* Usuario que creó el presupuesto */
  user?: {
    id: number;
    name: string;
    email?: string;
  };

  items: PresupuestoItem[];
}

/* Respuesta de la API cuando viene paginada */
export interface PresupuestoListResponse {
  data: Presupuesto[];
  current_page?: number;
  last_page?: number;
  total?: number;
}

/* Datos necesarios para crear/actualizar un presupuesto */
export interface PresupuestoPayload {
  cliente_id: number;
  estado: string;
  notas?: string | null;
  items: PresupuestoItem[];
}

@Injectable({ providedIn: 'root' })
export class PresupuestosApi {
  private api = `${environment.apiBaseUrl}/presupuestos`;

  constructor(private http: HttpClient) {}

  /* Trae la lista de presupuestos con filtro opcional */
  list(q = '') {
    return this.http.get<PresupuestoListResponse>(this.api + '?q=' + q);
  }

  /* Trae un presupuesto por id */
  show(id: number) {
    return this.http.get<Presupuesto>(`${this.api}/${id}`);
  }

  /* Crear presupuesto nuevo */
  create(data: PresupuestoPayload) {
    return this.http.post<Presupuesto>(this.api, data);
  }

  /* Modificar un presupuesto existente */
  update(id: number, data: PresupuestoPayload) {
    return this.http.put<Presupuesto>(`${this.api}/${id}`, data);
  }

  /* Eliminar presupuesto */
  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
