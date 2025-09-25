import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

type LoginBody = { email: string; password: string };
type RegisterBody = { name: string; email: string; password: string; password_confirmation: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private api = environment.apiUrl + '/auth';

  get token(): string | null {
    return localStorage.getItem('token');
  }
  set token(val: string | null) {
    if (val) localStorage.setItem('token', val);
    else localStorage.removeItem('token');
  }

  login(body: LoginBody) {
    return this.http.post<{ user: any; token: string }>(`${this.api}/login`, body);
  }

  register(body: RegisterBody) {
    return this.http.post<{ user: any; token: string }>(`${this.api}/register`, body);
  }

  me() {
    return this.http.get<any>(`${this.api}/me`);
  }

  logout() {
    return this.http.post(`${this.api}/logout`, {});
  }
}
