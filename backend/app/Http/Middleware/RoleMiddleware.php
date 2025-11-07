<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Uso en ruta: ->middleware('role:admin') o 'role:admin,empleado'
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Asumo que el campo se llama 'role' o 'rol' en tu tabla users
        $userRole = $user->role ?? $user->rol ?? null;

        if (!$userRole) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // si no se pasaron roles, dejo pasar; si se pasaron, verifico
        if (!empty($roles) && !in_array($userRole, $roles, true)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}
