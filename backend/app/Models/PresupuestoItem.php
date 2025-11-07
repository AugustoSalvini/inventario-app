<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PresupuestoItem extends Model
{
    protected $table = 'presupuesto_items';

    protected $fillable = [
        'presupuesto_id',
        'producto_id',
        'cantidad',
        'precio_unitario',
        'subtotal',
        'descripcion',
    ];

    protected $casts = [
        'cantidad'       => 'int',
        'precio_unitario'=> 'float',
        'subtotal'       => 'float',
    ];

    public function presupuesto()
    {
        return $this->belongsTo(Presupuesto::class);
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }
}
