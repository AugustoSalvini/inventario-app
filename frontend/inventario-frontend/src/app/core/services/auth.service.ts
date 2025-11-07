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

  register(data: any) { return this.http.post(`${this.api}/register`, data); }

  login(data: any) {
    return this.http.post(`${this.api}/login`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('userRole', res.user.rol);
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

  isLoggedIn() { return this.loggedIn$.value; }
  getRole() { return localStorage.getItem('userRole') || ''; }
  canEdit() { return ['admin','empleado'].includes(this.getRole()); }
  canDelete() { return this.getRole() === 'admin'; }
  getToken() { return localStorage.getItem('token'); }
}
