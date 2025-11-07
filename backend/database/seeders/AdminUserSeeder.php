<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(['email' => 'admin@demo.com'], [
            'name'     => 'Admin Demo',
            'password' => Hash::make('admin123'),
            'role'     => 'admin',
        ]);

        User::updateOrCreate(['email' => 'empleado@demo.com'], [
            'name'     => 'Empleado Demo',
            'password' => Hash::make('empleado123'),
            'role'     => 'empleado',
        ]);

        User::updateOrCreate(['email' => 'usuario@demo.com'], [
            'name'     => 'Usuario Demo',
            'password' => Hash::make('usuario123'),
            'role'     => 'usuario',
        ]);
    }
}
