<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductoController;

// AUTH
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login'])->middleware('throttle:5,1');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me',      [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});

// Pings por rol
Route::middleware(['auth:sanctum','role:admin'])
    ->get('/admin/ping', fn () => response()->json(['ok' => true, 'scope' => 'admin']));
Route::middleware(['auth:sanctum','role:admin,empleado'])
    ->get('/staff/ping', fn () => response()->json(['ok' => true, 'scope' => 'staff']));

// PRODUCTOS
Route::middleware(['auth:sanctum','role:admin,empleado,usuario'])->group(function () {
    Route::get('/productos',            [ProductoController::class, 'index']);
    Route::get('/productos/{producto}', [ProductoController::class, 'show']);
});

Route::middleware(['auth:sanctum','role:admin,empleado'])->group(function () {
    Route::post('/productos',           [ProductoController::class, 'store']);
    Route::put('/productos/{producto}', [ProductoController::class, 'update']);
    Route::patch('/productos/{producto}/stock', [ProductoController::class, 'updateStock']);
});

Route::middleware(['auth:sanctum','role:admin'])->group(function () {
    Route::delete('/productos/{producto}', [ProductoController::class, 'destroy']);
});
