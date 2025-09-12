<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 50)->nullable()->unique(); // SKU opcional
            $table->string('nombre', 150);
            $table->text('descripcion')->nullable();
            $table->decimal('precio', 12, 2)->default(0);
            $table->integer('stock')->default(0);
            $table->boolean('activo')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['nombre']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
