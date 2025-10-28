<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre','email','telefono','direccion','cuit'
    ];

    public function presupuestos()
    {
        return $this->hasMany(Presupuesto::class);
    }
}
