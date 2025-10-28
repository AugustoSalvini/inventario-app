import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private base = environment.apiBaseUrl + '/clientes';
  constructor(private http: HttpClient) {}
  list(q = '', page = 1, perPage = 10) {
    const params = new HttpParams().set('q', q).set('page', page).set('per_page', perPage);
    return this.http.get<any>(this.base, { params });
  }
  get(id: number)       { return this.http.get(`${this.base}/${id}`); }
  create(dto: any)      { return this.http.post(this.base, dto); }
  update(id: number, d: any) { return this.http.put(`${this.base}/${id}`, d); }
  delete(id: number)    { return this.http.delete(`${this.base}/${id}`); }
}
