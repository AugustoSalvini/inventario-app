<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            // agrega solo si no existen (evita choques si ya estaban)
            if (!Schema::hasColumn('productos', 'codigo')) {
                $table->string('codigo', 50)->nullable()->unique()->after('id');
            }
            if (!Schema::hasColumn('productos', 'descripcion')) {
                $table->text('descripcion')->nullable()->after('nombre');
            }
            if (!Schema::hasColumn('productos', 'activo')) {
                $table->boolean('activo')->default(true)->after('stock');
            }
            if (!Schema::hasColumn('productos', 'deleted_at')) {
                $table->softDeletes(); // para SoftDeletes
            }
        });
    }

    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            if (Schema::hasColumn('productos', 'codigo')) {
                $table->dropUnique(['codigo']);
                $table->dropColumn('codigo');
            }
            if (Schema::hasColumn('productos', 'descripcion')) {
                $table->dropColumn('descripcion');
            }
            if (Schema::hasColumn('productos', 'activo')) {
                $table->dropColumn('activo');
            }
            if (Schema::hasColumn('productos', 'deleted_at')) {
                $table->dropColumn('deleted_at');
            }
        });
    }
};
