<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

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
