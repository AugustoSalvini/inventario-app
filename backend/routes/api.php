<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductoController;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login'])->middleware('throttle:5,1');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me',      [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});

Route::middleware(['auth:sanctum','role:admin'])
    ->get('/admin/ping', fn () => response()->json(['ok' => true, 'scope' => 'admin']));
Route::middleware(['auth:sanctum','role:admin,empleado'])
    ->get('/staff/ping', fn () => response()->json(['ok' => true, 'scope' => 'staff']));

    // === PRODUCTOS ===
// Listar / ver: admin y empleado
// Crear/actualizar/eliminar/stock: sólo admin (puede cambiarlo a gusto)
Route::middleware(['auth:sanctum','role:admin,empleado,usuario'])->group(function () {
    Route::get('/productos', [ProductoController::class, 'index']);
    Route::get('/productos/{producto}', [ProductoController::class, 'show']);
});


Route::middleware(['auth:sanctum','role:admin'])->group(function () {
    Route::post('/productos', [ProductoController::class, 'store']);
    Route::put('/productos/{producto}', [ProductoController::class, 'update']);
    Route::patch('/productos/{producto}', [ProductoController::class, 'update']);
    Route::delete('/productos/{producto}', [ProductoController::class, 'destroy']);
    Route::patch('/productos/{producto}/stock', [ProductoController::class, 'updateStock']);
});
// listar: admin, empleado, usuario
Route::get('/productos', [ProductoController::class, 'index'])
    ->middleware('role:admin,empleado,usuario');

// crear / editar: admin, empleado
Route::post('/productos', [ProductoController::class, 'store'])
    ->middleware('role:admin,empleado');
Route::put('/productos/{id}', [ProductoController::class, 'update'])
    ->middleware('role:admin,empleado');

// eliminar: solo admin
Route::delete('/productos/{id}', [ProductoController::class, 'destroy'])
    ->middleware('role:admin');
