<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cliente;

class ClienteSeeder extends Seeder
{
    public function run(): void
    {
        Cliente::updateOrCreate(['id' => 1], [
            'nombre' => 'Juan Pérez',
            'email'  => 'juan@demo.com',
            'telefono' => '345-123456',
        ]);

        Cliente::updateOrCreate(['id' => 2], [
            'nombre' => 'Ferretería Gómez',
            'email'  => 'contacto@fergomez.com',
            'telefono' => '345-222333',
        ]);
    }
}
