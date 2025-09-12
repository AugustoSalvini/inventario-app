<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('presupuestos', function (Blueprint $table) {
            $table->id();

            // Quien lo crea (admin o empleado)
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            // Cliente (opcional)
            $table->foreignId('cliente_id')
                ->nullable()
                ->constrained('clientes')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->enum('estado', ['borrador', 'enviado', 'aceptado', 'rechazado', 'vencido'])
                ->default('borrador')
                ->index();

            $table->date('fecha_vencimiento')->nullable();
            $table->decimal('total', 12, 2)->default(0);
            $table->text('notas')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'cliente_id', 'estado']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('presupuestos');
    }
};
