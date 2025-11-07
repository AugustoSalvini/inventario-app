<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\PresupuestoController;

// Auth
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
    Route::post('logout',   [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('me',        [AuthController::class, 'me'])->middleware('auth:sanctum');
});

// Productos (solo auth por ahora)
Route::middleware('auth:sanctum')->group(function () {
    Route::get   ('/productos',                     [ProductoController::class, 'index']);
    Route::post  ('/productos',                     [ProductoController::class, 'store']);
    Route::get   ('/productos/{producto}',          [ProductoController::class, 'show']);
    Route::put   ('/productos/{producto}',          [ProductoController::class, 'update']);
    Route::delete('/productos/{producto}',          [ProductoController::class, 'destroy']);
    Route::patch ('/productos/{producto}/stock',    [ProductoController::class, 'updateStock']);
    Route::apiResource('presupuestos', PresupuestoController::class);
    Route::get   ('/presupuestos',               [PresupuestoController::class, 'index']);
    Route::post  ('/presupuestos',               [PresupuestoController::class, 'store']);
    Route::get   ('/presupuestos/{presupuesto}', [PresupuestoController::class, 'show']);
    Route::put   ('/presupuestos/{presupuesto}', [PresupuestoController::class, 'update']);
    Route::delete('/presupuestos/{presupuesto}', [PresupuestoController::class, 'destroy']);
});

