<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * Middleware globales de la app.
     */
    protected $middleware = [
        // CORS nativo de Laravel 11 va arriba en la pila
        \Illuminate\Http\Middleware\HandleCors::class,

        \App\Http\Middleware\TrustProxies::class,
        \Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance::class,
        \Illuminate\Http\Middleware\ValidatePostSize::class,
        \Illuminate\Foundation\Http\Middleware\TrimStrings::class,
        \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
        \Illuminate\Foundation\Http\Middleware\InvokeDeferredCallbacks::class,
    ];

    /**
     * Aliases de middleware (antes llamado $routeMiddleware).
     */
    protected $middlewareAliases = [
        // Auth
        'auth'              => \Illuminate\Auth\Middleware\Authenticate::class,
        'auth.basic'        => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
        'auth.session'      => \Illuminate\Session\Middleware\AuthenticateSession::class,

        // Autorización/firmas/etc.
        'can'               => \Illuminate\Auth\Middleware\Authorize::class,
        'password.confirm'  => \Illuminate\Auth\Middleware\RequirePassword::class,
        'signed' => \Illuminate\Routing\Middleware\ValidateSignature::class,    
        // ^^^ Si NO tenés una ValidateSignature propia, usa la de framework:
        // 'signed'         => \Illuminate\Routing\Middleware\ValidateSignature::class,

        // Invitados / verificación / rate limit / cache
        'guest'             => \App\Http\Middleware\RedirectIfAuthenticated::class,
        'verified'          => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
        'throttle'          => \Illuminate\Routing\Middleware\ThrottleRequests::class,
        'cache.headers'     => \Illuminate\Http\Middleware\SetCacheHeaders::class,

        // 🔹 Alias del middleware de roles que creaste
        'role'              => \App\Http\Middleware\RoleMiddleware::class,
    ];
}
