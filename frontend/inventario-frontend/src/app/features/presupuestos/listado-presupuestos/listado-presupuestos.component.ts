import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PresupuestosApi, Presupuesto } from '../presupuestos.api';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-listado-presupuestos',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './listado-presupuestos.component.html',
})
export class ListadoPresupuestosComponent implements OnInit {
  q=''; data: Presupuesto[]=[]; loading=false; error='';

  constructor(private api: PresupuestosApi, public auth: AuthService, private router: Router){}
  ngOnInit(){ this.fetch(); }

  fetch(){
    this.loading = true;
    this.api.list(this.q).subscribe({
      next: d => { this.data = d; this.loading = false; },
      error: _ => { this.error = 'No se pudieron cargar'; this.loading = false; }
    });
  }
  buscar(){ this.fetch(); }
  nuevo(){ if(!this.auth.canEdit()) return; this.router.navigate(['/presupuestos/nuevo']); }
  editar(p: Presupuesto){ if(!this.auth.canEdit()) return; this.router.navigate(['/presupuestos', p.id, 'editar']); }
  eliminar(p: Presupuesto){
    if(!this.auth.canDelete()) return;
    if(!confirm('¿Eliminar presupuesto?')) return;
    this.api.delete(p.id).subscribe({ next:_=>this.fetch() });
  }
}
