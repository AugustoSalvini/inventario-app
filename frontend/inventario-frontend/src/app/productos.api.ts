import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  created_at?: string;
  updated_at?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductosApi {
  private base = `${environment.apiBaseUrl}/productos`;

  constructor(private http: HttpClient) {}

  /** Siempre emite Producto[] aunque el backend devuelva [] o {data: []} */
  list(q?: string): Observable<Producto[]> {
    const options =
      q
        ? { params: { q }, observe: 'body' as const }
        : { observe: 'body' as const };

    return this.http
      .get<Producto[] | { data: Producto[] }>(this.base, options)
      .pipe(
        map((res: any) => (Array.isArray(res) ? res : (res?.data ?? [])))
      );
  }

  get(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.base}/${id}`, { observe: 'body' as const });
  }

  create(body: Partial<Producto>): Observable<Producto> {
    return this.http.post<Producto>(this.base, body, { observe: 'body' as const });
  }

  update(id: number, body: Partial<Producto>): Observable<Producto> {
    return this.http.put<Producto>(`${this.base}/${id}`, body, { observe: 'body' as const });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`, { observe: 'body' as const });
  }
  remove(id: number): Observable<void> {
    return this.delete(id);
  }

  updateStock(id: number, stock: number): Observable<Producto> {
    return this.http.patch<Producto>(`${this.base}/${id}/stock`, { stock }, { observe: 'body' as const });
  }
}
