<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * Usage in routes: ->middleware('role:admin,empleado')
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }
        $userRole = $user->rol ?? $user->role ?? null;
        if (!$userRole || !in_array($userRole, $roles)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }
        return $next($request);
    }
}
