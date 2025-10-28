import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _role: 'admin'|'empleado'|'user' = (localStorage.getItem('role') as any) || 'user';

  set role(r: 'admin'|'empleado'|'user') { this._role = r; localStorage.setItem('role', r); }
  get role() { return this._role; }

  get canEdit() { return ['admin','empleado'].includes(this.role); }
  get isAdmin() { return this.role === 'admin'; }

  roleIn(roles: string[]): boolean { return roles.includes(this.role); } // <-- nuevo
}
