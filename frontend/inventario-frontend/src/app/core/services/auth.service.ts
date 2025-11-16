// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = `${environment.apiBaseUrl}/auth`;
  private loggedIn$ = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));

  constructor(private http: HttpClient, private router: Router) {}

  register(data: any) {
    return this.http.post(`${this.api}/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.api}/login`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('userRole', res.user.rol); // 👈 viene de la BD
        localStorage.setItem('userName', res.user.name);
        this.loggedIn$.next(true);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    this.loggedIn$.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return this.loggedIn$.value;
  }

  /** Rol crudo tal como viene del backend, en minúsculas */
  private rawRole(): string {
  return (localStorage.getItem('userRole') || '').trim().toLowerCase();
}


  /** Rol expuesto si lo necesitás en otros lados */
  getRole(): string {
    return this.rawRole();
  }

  /** 👤 Es usuario “común” */
  isUser(): boolean {
    const r = this.rawRole();
    // Soportamos tanto 'user' como 'usuario' por si en la BD está en español
    return r === 'user' || r === 'usuario';
  }

  /** 🧰 Es empleado */
  isEmpleado(): boolean {
    return this.rawRole() === 'empleado';
  }

  /** 👑 Es admin */
  isAdmin(): boolean {
    return this.rawRole() === 'admin';
  }

  /** Permisos de edición (admin + empleado) */
  canEdit(): boolean {
    return this.isAdmin() || this.isEmpleado();
  }

  /** Permisos de borrado (solo admin) */
  canDelete(): boolean {
    return this.isAdmin();
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
