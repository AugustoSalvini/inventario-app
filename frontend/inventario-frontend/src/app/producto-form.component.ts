import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ProductosApi, Producto } from './productos.api';

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html'
})
export class ProductoFormComponent implements OnInit {
  id?: number;
  loading = false;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ProductosApi,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      codigo: [''],
      nombre: ['', [Validators.required, Validators.maxLength(150)]],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      activo: [true],
    });
  }

  async ngOnInit() {
    const param = this.route.snapshot.paramMap.get('id');
    this.id = param ? Number(param) : undefined;

    if (this.id) {
      this.loading = true;
      try {
        const res = await firstValueFrom(this.api.get(this.id));
        this.form.patchValue(res.data);
      } finally {
        this.loading = false;
      }
    }
  }

  async submit() {
    if (this.form.invalid) return;
    this.loading = true;
    try {
      const body = this.form.value as Producto;
      // Normalizo numéricos por las dudas
      body.precio = Number(body.precio);
      body.stock  = Number(body.stock);

      if (this.id) {
        await firstValueFrom(this.api.update(this.id, body));
        alert('Producto actualizado');
      } else {
        await firstValueFrom(this.api.create(body));
        alert('Producto creado');
      }
      this.router.navigate(['/productos']);
    } catch (e) {
      console.error(e);
      alert('No se pudo guardar');
    } finally {
      this.loading = false;
    }
  }
}
