<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Presupuesto extends Model
{
    protected $table = 'presupuestos';

    protected $fillable = [
        'user_id',
        'cliente_id',
        'estado',
        'total',
        'notas',
    ];

    protected $casts = [
        'user_id'   => 'integer',
        'cliente_id'=> 'integer',
        'total'     => 'decimal:2',
    ];
}
