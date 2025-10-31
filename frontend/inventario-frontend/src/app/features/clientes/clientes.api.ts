import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Cliente {
  id: number;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  cuit?: string;
}

@Injectable({ providedIn: 'root' })
export class ClientesApi {
  private base = `${environment.apiBaseUrl}/clientes`;
  constructor(private http: HttpClient) {}

  list(q=''){ return this.http.get<Cliente[]>(`${this.base}?q=${encodeURIComponent(q)}`); }
  show(id:number){ return this.http.get<Cliente>(`${this.base}/${id}`); }
  create(data: Partial<Cliente>){ return this.http.post<Cliente>(this.base, data); }
  update(id:number, data: Partial<Cliente>){ return this.http.put<Cliente>(`${this.base}/${id}`, data); }
  delete(id:number){ return this.http.delete(`${this.base}/${id}`); }
}
