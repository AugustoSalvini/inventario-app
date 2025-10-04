import { Routes } from '@angular/router';
import { ProductosComponent } from './productos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    // como tus archivos son login.ts y register.ts:
    loadComponent: () =>
      import('./login').then(m => m.LoginComponent),
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./register').then(m => m.RegisterComponent),
  },

  { path: 'productos', component: ProductosComponent },
];
