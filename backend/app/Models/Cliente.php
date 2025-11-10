<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    protected $table = 'clientes';

    protected $fillable = [
        'nombre',
        'email',
        'telefono',
    ];

    public function presupuestos()
    {
        return $this->hasMany(Presupuesto::class);
    }
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

