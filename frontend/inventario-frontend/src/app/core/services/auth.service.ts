import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiBaseUrl}/auth`;

  // ✅ propiedad pública para compatibilidad con login.ts
  public token: string | null = localStorage.getItem('token');

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
      tap((res) => {
        // Soportar distintas claves que pueda devolver el backend
        const t: string | undefined = res?.token || res?.access_token || res?.jwt;
        if (t) {
          localStorage.setItem('token', t);
          this.token = t; // ← compat con this.auth.token = ...
        }
        if (res?.user?.rol) localStorage.setItem('role', res.user.rol);
      })
    );
  }

  register(data: any) {
    return this.http.post<any>(`${this.baseUrl}/register`, data);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.token = null;
    this.router.navigate(['/login']);
  }

  // === Roles / helpers ===
  getRole(): string { return localStorage.getItem('role') || 'user'; }
  isLoggedIn(): boolean { return !!(this.token || localStorage.getItem('token')); }
  isAdmin(): boolean { return this.getRole() === 'admin'; }
  isEmpleado(): boolean { return this.getRole() === 'empleado'; }
  isUser(): boolean { return this.getRole() === 'user'; }
  canEdit(): boolean { return this.isAdmin() || this.isEmpleado(); }
  canDelete(): boolean { return this.isAdmin(); }
  roleIn(roles: string[]): boolean { return roles.includes(this.getRole()); }
}
