<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Si ya existiera, evitamos colisión
            if (!Schema::hasColumn('users', 'role')) {
                $table->enum('role', ['admin', 'empleado', 'usuario'])
                    ->default('usuario')
                    ->after('password')
                    ->index();
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'role')) {
                $table->dropColumn('role');
            }
        });
    }
};
