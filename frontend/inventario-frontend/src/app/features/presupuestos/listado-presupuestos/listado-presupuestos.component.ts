import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresupuestosService } from '../../../core/api/presupuestos.service';

@Component({
  selector: 'app-listado-presupuestos',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, DecimalPipe],
  templateUrl: './listado-presupuestos.component.html',
  styleUrls: ['./listado-presupuestos.component.css']
})
export class ListadoPresupuestosComponent implements OnInit {
  q = ''; estado = '';
  data: any;
  page = 1; perPage = 10; loading = false;

  constructor(private api: PresupuestosService) {}
  ngOnInit(): void { this.buscar(); }

  buscar(): void {
    this.loading = true;
    this.api.list(this.q, this.estado, this.page, this.perPage).subscribe({
      next: (res) => { this.data = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
