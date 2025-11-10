// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProductosComponent } from './productos.component';        // tu productos standalone
import { AuthGuard } from './core/guards/auth.guard';

// Clientes
import { ListadoClientesComponent } from './features/clientes/listado-clientes/listado-clientes.component';
import { EditarClienteComponent } from './features/clientes/editar-cliente/editar-cliente.component';

// Presupuestos
import { ListadoPresupuestosComponent } from './features/presupuestos/listado-presupuestos/listado-presupuestos.component';
import { EditarPresupuestoComponent } from './features/presupuestos/editar-presupuesto/editar-presupuesto.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'productos', component: ProductosComponent, canActivate: [AuthGuard] },

  // Clientes
  { path: 'clientes', component: ListadoClientesComponent, canActivate: [AuthGuard] },
  { path: 'clientes/nuevo', component: EditarClienteComponent, canActivate: [AuthGuard] },
  { path: 'clientes/:id/editar', component: EditarClienteComponent, canActivate: [AuthGuard] },

  // Presupuestos
  { path: 'presupuestos', component: ListadoPresupuestosComponent, canActivate: [AuthGuard] },
  { path: 'presupuestos/nuevo', component: EditarPresupuestoComponent, canActivate: [AuthGuard] },
  { path: 'presupuestos/:id/editar', component: EditarPresupuestoComponent, canActivate: [AuthGuard] },

  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];
