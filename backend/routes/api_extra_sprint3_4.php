<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\PresupuestoController;

Route::middleware('auth:sanctum')->group(function () {
    // Clientes
    Route::get('/clientes', [ClienteController::class, 'index']);
    Route::get('/clientes/{id}', [ClienteController::class, 'show']);
    Route::post('/clientes', [ClienteController::class, 'store'])->middleware('role:admin,empleado');
    Route::put('/clientes/{id}', [ClienteController::class, 'update'])->middleware('role:admin,empleado');
    Route::delete('/clientes/{id}', [ClienteController::class, 'destroy'])->middleware('role:admin');

    // Presupuestos
    Route::get('/presupuestos', [PresupuestoController::class, 'index']);
    Route::get('/presupuestos/{id}', [PresupuestoController::class, 'show']);
    Route::post('/presupuestos', [PresupuestoController::class, 'store'])->middleware('role:admin,empleado');
    Route::put('/presupuestos/{id}', [PresupuestoController::class, 'update'])->middleware('role:admin,empleado');
    Route::delete('/presupuestos/{id}', [PresupuestoController::class, 'destroy'])->middleware('role:admin');
});
