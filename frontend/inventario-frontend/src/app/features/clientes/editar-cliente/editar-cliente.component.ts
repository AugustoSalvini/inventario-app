import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClientesService } from '../../../core/api/clientes.service';

@Component({
  selector: 'app-editar-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.css']
})
export class EditarClienteComponent {
  form: FormGroup;
  saving = false;

  constructor(private fb: FormBuilder, private api: ClientesService) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      email: ['',[Validators.email]],
      telefono: [''],
      direccion: [''],
      cuit: [''],
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.api.create(this.form.value).subscribe({
      next: () => { this.saving = false; alert('Guardado'); },
      error: () => { this.saving = false; }
    });
  }
}
