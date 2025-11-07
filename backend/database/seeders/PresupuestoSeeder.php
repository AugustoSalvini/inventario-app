<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Presupuesto;

class PresupuestoSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@demo.com')->first();

        if (!$admin) return;

        $ejemplos = [
            ['cliente_id' => 1, 'estado' => 'borrador',   'total' => 12000, 'notas' => 'Primera visita.'],
            ['cliente_id' => 2, 'estado' => 'confirmado', 'total' =>  8500, 'notas' => 'Entrega en 48hs.'],
            ['cliente_id' => 3, 'estado' => 'cancelado',  'total' =>  5000, 'notas' => 'Cliente desistió.'],
        ];

        foreach ($ejemplos as $e) {
            Presupuesto::updateOrCreate(
                ['cliente_id' => $e['cliente_id'], 'estado' => $e['estado'], 'total' => $e['total']],
                $e + ['user_id' => $admin->id]
            );
        }
    }
}
