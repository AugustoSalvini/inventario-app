<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Cliente;
use App\Models\Producto;
use App\Models\Presupuesto;
use App\Models\PresupuestoItem;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ==== Usuarios base ====
        $admin = User::updateOrCreate(['email' => 'admin@demo.com'], [
            'name'     => 'Admin Demo',
            'password' => Hash::make('admin123'),
            'role'     => 'admin',
        ]);

        $empleado = User::updateOrCreate(['email' => 'empleado@demo.com'], [
            'name'     => 'Empleado Demo',
            'password' => Hash::make('empleado123'),
            'role'     => 'empleado',
        ]);

        $usuario = User::updateOrCreate(['email' => 'usuario@demo.com'], [
            'name'     => 'Usuario Demo',
            'password' => Hash::make('usuario123'),
            'role'     => 'usuario',
        ]);

        // ==== Clientes para cada user ====
        $cAdmin    = Cliente::updateOrCreate(['user_id' => $admin->id],    ['nombre' => $admin->name,    'email' => $admin->email]);
        $cEmpleado = Cliente::updateOrCreate(['user_id' => $empleado->id], ['nombre' => $empleado->name, 'email' => $empleado->email]);
        $cUsuario  = Cliente::updateOrCreate(['user_id' => $usuario->id],  ['nombre' => $usuario->name,  'email' => $usuario->email]);

        // ==== Productos demo ====
        foreach ([
            ['codigo'=>'P-001','nombre'=>'Lapicera azul','descripcion'=>'Lapicera tinta gel','precio'=>1200.50,'stock'=>50,'activo'=>true],
            ['codigo'=>'P-002','nombre'=>'Cuaderno A5','descripcion'=>'Tapa blanda 80 hojas','precio'=>3500.00,'stock'=>20,'activo'=>true],
            ['codigo'=>'P-003','nombre'=>'Regla 20cm','descripcion'=>null,'precio'=>900.00,'stock'=>100,'activo'=>true],
        ] as $p) {
            Producto::updateOrCreate(['codigo' => $p['codigo']], $p);
        }

        // ==== Presupuestos demo (con user_id y cliente_id válidos) ====
        $p1 = Presupuesto::updateOrCreate(
            ['cliente_id' => $cAdmin->id, 'estado' => 'borrador', 'total' => 12000],
            ['user_id' => $admin->id, 'notas' => 'Primera visita.']
        );

        $p2 = Presupuesto::updateOrCreate(
            ['cliente_id' => $cEmpleado->id, 'estado' => 'borrador', 'total' => 2401.00],
            ['user_id' => $empleado->id, 'notas' => 'Material escolar.']
        );

        $p3 = Presupuesto::updateOrCreate(
            ['cliente_id' => $cUsuario->id, 'estado' => 'borrador', 'total' => 14000.00],
            ['user_id' => $usuario->id, 'notas' => 'Set de escritorio.']
        );

        // Ítems ejemplo (opcional)
        PresupuestoItem::updateOrCreate(
            ['presupuesto_id' => $p1->id, 'producto_id' => null, 'descripcion' => 'Servicio general', 'cantidad' => 1, 'precio' => 12000],
            []
        );
    }
}
