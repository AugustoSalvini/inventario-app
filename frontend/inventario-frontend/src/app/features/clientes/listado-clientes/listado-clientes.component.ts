import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClientesApi, Cliente } from '../clientes.api';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-listado-clientes',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './listado-clientes.component.html',
})
export class ListadoClientesComponent implements OnInit {
  q=''; data: Cliente[]=[]; loading=false; error='';

  constructor(private api: ClientesApi, public auth: AuthService, private router: Router){}

  ngOnInit(){ this.fetch(); }

  fetch(){
    this.loading = true;
    this.api.list(this.q).subscribe({
      next: d => { this.data = d; this.loading = false; },
      error: _ => { this.error = 'No se pudieron cargar los clientes'; this.loading = false; }
    });
  }

  buscar(){ this.fetch(); }

  nuevo(){ if(!this.auth.canEdit()) return; this.router.navigate(['/clientes/nuevo']); }

  editar(c: Cliente){ if(!this.auth.canEdit()) return; this.router.navigate(['/clientes', c.id, 'editar']); }

  eliminar(c: Cliente){
    if(!this.auth.canDelete()) return;
    if(!confirm(`¿Eliminar "${c.nombre}"?`)) return;
    this.api.delete(c.id).subscribe({ next:_=>this.fetch() });
  }
}
