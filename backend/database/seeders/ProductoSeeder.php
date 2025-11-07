<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Producto;

class ProductoSeeder extends Seeder
{
    public function run(): void
    {
        // Ejemplos idempotentes
        Producto::updateOrCreate(
            ['codigo' => 'PRD-001'],
            [
                'nombre' => 'Ladrillo 12x18',
                'descripcion' => 'Ladrillo común',
                'precio' => 1500.00,
                'stock' => 120,
                'activo' => true,
            ]
        );

        Producto::updateOrCreate(
            ['codigo' => 'PRD-002'],
            [
                'nombre' => 'Cemento 50kg',
                'descripcion' => 'Bolsa de cemento',
                'precio' => 9800.00,
                'stock' => 35,
                'activo' => true,
            ]
        );
    }
}
