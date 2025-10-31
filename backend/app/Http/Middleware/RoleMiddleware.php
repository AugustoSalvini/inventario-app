<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    /**
     * Uso en rutas:
     *   ->middleware('role:admin,empleado')
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // Con Sanctum, esto trae al usuario por el token Bearer
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        // Cambiá a $user->rol si tu columna se llama "rol"
        $current = strtolower((string) $user->role);

        // Normalizamos los roles permitidos
        $roles = array_map('strtolower', $roles);

        if (!in_array($current, $roles, true)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        return $next($request);
    }
}
