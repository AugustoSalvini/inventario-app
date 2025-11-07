<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Producto;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Usuarios base
        User::updateOrCreate(['email' => 'admin@demo.com'], [
            'name' => 'Admin Demo',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        User::updateOrCreate(['email' => 'empleado@demo.com'], [
            'name' => 'Empleado Demo',
            'password' => Hash::make('empleado123'),
            'role' => 'empleado',
        ]);

        User::updateOrCreate(['email' => 'usuario@demo.com'], [
            'name' => 'Usuario Demo',
            'password' => Hash::make('usuario123'),
            'role' => 'usuario',
        ]);

        // Productos base
        foreach ([
            ['codigo'=>'P-001','nombre'=>'Lapicera azul','descripcion'=>'Lapicera tinta gel','precio'=>1200.50,'stock'=>50,'activo'=>true],
            ['codigo'=>'P-002','nombre'=>'Cuaderno A5','descripcion'=>'Tapa blanda 80 hojas','precio'=>3500.00,'stock'=>20,'activo'=>true],
            ['codigo'=>'P-003','nombre'=>'Regla 20cm','descripcion'=>null,'precio'=>900.00,'stock'=>100,'activo'=>true],
        ] as $p) {
            Producto::updateOrCreate(['codigo' => $p['codigo']], $p);
        }

        // ⚠️ Importante: primero clientes, luego presupuestos (por la FK cliente_id)
        $this->call([
            ClienteSeeder::class,
            PresupuestoSeeder::class,
            AdminUserSeeder::class,
            PresupuestoSeeder::class,
        ]);
    }
}
