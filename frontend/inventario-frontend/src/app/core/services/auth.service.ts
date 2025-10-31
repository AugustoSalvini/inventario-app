import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  // --- Registro ---
  register(data: any): Observable<any> {
    return this.http.post(`${this.api}/register`, data);
  }

  // --- Login ---
  login(data: any): Observable<any> {
    return this.http.post(`${this.api}/login`, data).pipe(
      tap((res: any) => {
        // ✅ Guarda token y datos del usuario
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('userRole', res.user.rol);  // asegúrate que el backend devuelva "rol"
        localStorage.setItem('userName', res.user.name);
      })
    );
  }

  // --- Logout ---
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    this.router.navigate(['/login']);
  }

  // --- Estado ---
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // --- Rol actual ---
  getRole(): string {
    return localStorage.getItem('userRole') || '';
  }

  // --- Permisos ---
  canEdit(): boolean {
    const role = this.getRole();
    return role === 'admin' || role === 'empleado';
  }

  canDelete(): boolean {
    return this.getRole() === 'admin';
  }

  // --- Alias ---
  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  isEmpleado(): boolean {
    return this.getRole() === 'empleado';
  }

  // --- Obtener token ---
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
