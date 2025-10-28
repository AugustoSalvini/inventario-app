import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../../core/api/clientes.service';

@Component({
  selector: 'app-listado-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listado-clientes.component.html',
  styleUrls: ['./listado-clientes.component.css']
})
export class ListadoClientesComponent implements OnInit {
  q = '';
  data: any;
  page = 1;
  perPage = 10;
  loading = false;

  constructor(private api: ClientesService) {}
  ngOnInit(): void { this.buscar(); }
  buscar(): void {
    this.loading = true;
    this.api.list(this.q, this.page, this.perPage).subscribe({
      next: (res) => { this.data = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
