<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Presupuesto extends Model
{
    use HasFactory;

    protected $table = 'presupuestos';

    protected $fillable = [
        'user_id',
        'cliente_id',
        'estado',     // 'borrador' | 'confirmado' | 'cancelado'
        'total',
        'notas',
    ];

    protected $casts = [
        'total' => 'decimal:2',
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function items()
    {
        return $this->hasMany(PresupuestoItem::class);
    }

    /** ✅ Método para recalcular el total del presupuesto */
    public function recalcularTotal(): void
    {
        $this->total = $this->items()->sum('subtotal');
        $this->save();
    }
}
