<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('presupuesto_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('presupuesto_id')
                ->constrained('presupuestos')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            // Referencia al producto (opcional, por si luego el producto se elimina)
            $table->foreignId('producto_id')
                ->nullable()
                ->constrained('productos')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            // Copia de seguridad de datos del ítem (inmutables dentro del presupuesto)
            $table->string('descripcion', 200);                 // nombre/desc del producto al momento de cotizar
            $table->integer('cantidad')->default(1);
            $table->decimal('precio_unitario', 12, 2)->default(0);
            $table->decimal('subtotal', 12, 2)->default(0);

            $table->timestamps();

            $table->index(['presupuesto_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('presupuesto_items');
    }
};
