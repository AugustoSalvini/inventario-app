<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 120);
            $table->string('apellido', 120)->nullable();
            $table->string('email')->nullable()->unique();
            $table->string('telefono', 30)->nullable();
            $table->string('direccion', 255)->nullable();
            $table->string('cuit', 20)->nullable()->unique();
            $table->boolean('activo')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['nombre', 'apellido']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};
