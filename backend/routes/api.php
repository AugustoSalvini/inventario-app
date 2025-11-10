<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\PresupuestoController;

// =========================
// AUTH
// =========================
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
    Route::post('logout',   [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('me',        [AuthController::class, 'me'])->middleware('auth:sanctum');
});

// =========================
// PROTECTED API
// =========================
Route::middleware('auth:sanctum')->group(function () {
    // Productos
    Route::apiResource('productos', ProductoController::class);
    Route::put('productos/{producto}/stock', [ProductoController::class, 'updateStock']); // o PATCH si preferís

    // Presupuestos
    Route::apiResource('presupuestos', PresupuestoController::class);
});
