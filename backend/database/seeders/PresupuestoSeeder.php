<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Cliente;
use App\Models\Producto;
use App\Models\Presupuesto;
use App\Models\PresupuestoItem;

class PresupuestoSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();
        $cliente = Cliente::first();
        $prod = Producto::first();

        if (!$user || !$cliente || !$prod) return;

        $p = Presupuesto::create([
            'user_id'    => $user->id,
            'cliente_id' => $cliente->id,
            'estado'     => 'borrador',
            'notas'      => 'Ejemplo inicial',
            'total'      => 0,
        ]);

        $subtotal = 2 * 1500.00;

        PresupuestoItem::create([
            'presupuesto_id' => $p->id,
            'producto_id'    => $prod->id,
            'descripcion'    => 'Item ejemplo',
            'cantidad'       => 2,
            'precio_unitario'=> 1500.00,
            'subtotal'       => $subtotal,
        ]);

        // 🔥 recalcula total correctamente
        $p->recalcularTotal();
    }
}
