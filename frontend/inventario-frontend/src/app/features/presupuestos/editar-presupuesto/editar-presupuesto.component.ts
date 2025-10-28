import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PresupuestosService } from '../../../core/api/presupuestos.service';

@Component({
  selector: 'app-editar-presupuesto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-presupuesto.component.html',
  styleUrls: ['./editar-presupuesto.component.css']
})
export class EditarPresupuestoComponent {
  form: FormGroup;
  saving = false;

  constructor(private fb: FormBuilder, private api: PresupuestosService) {
    this.form = this.fb.group({
      cliente_id: [null, Validators.required],
      fecha: [''],
      estado: ['borrador'],
      items: this.fb.array([])
    });
    this.addItem();
  }

  get items(): FormArray { return this.form.get('items') as FormArray; }

  addItem(): void {
    this.items.push(this.fb.group({
      productoId: [null, Validators.required],
      nombre: ['', Validators.required],
      cantidad: [1, [Validators.required]],
      precio: [0, [Validators.required]]
    }));
  }

  total(): number {
    return this.items.value.reduce((acc: number, it: any) => acc + (+it.cantidad * +it.precio), 0);
  }

  submit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const dto = {...this.form.value, total: this.total() };
    this.api.create(dto).subscribe({
      next: () => { this.saving = false; alert('Presupuesto guardado'); },
      error: () => { this.saving = false; }
    });
  }
}
