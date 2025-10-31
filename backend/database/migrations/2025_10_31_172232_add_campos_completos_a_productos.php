<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('productos', function (Blueprint $table) {
            if (!Schema::hasColumn('productos','codigo')) {
                $table->string('codigo',50)->unique()->after('id');
            }
            if (!Schema::hasColumn('productos','descripcion')) {
                $table->text('descripcion')->nullable()->after('nombre');
            }
            if (!Schema::hasColumn('productos','precio')) {
                $table->decimal('precio',10,2)->default(0)->after('descripcion');
            }
            if (!Schema::hasColumn('productos','stock')) {
                $table->integer('stock')->default(0)->after('precio');
            }
            if (!Schema::hasColumn('productos','activo')) {
                $table->boolean('activo')->default(true)->after('stock');
            }
        });
    }

    public function down(): void {
        Schema::table('productos', function (Blueprint $table) {
            if (Schema::hasColumn('productos','activo')) $table->dropColumn('activo');
            if (Schema::hasColumn('productos','stock'))  $table->dropColumn('stock');
            if (Schema::hasColumn('productos','precio')) $table->dropColumn('precio');
            if (Schema::hasColumn('productos','descripcion')) $table->dropColumn('descripcion');
            if (Schema::hasColumn('productos','codigo')) $table->dropColumn('codigo');
        });
    }
};
