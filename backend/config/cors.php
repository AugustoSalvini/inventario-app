<?php

return [
    // Para no fallar con rutas, probemos con todo
    'paths' => ['*'],

    'allowed_methods' => ['*'],

    // Como NO usamos credenciales (cookies) podemos abrir a cualquier origen
    'allowed_origins' => ['*'],
    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // En dev con tokens Bearer, esto en false
    'supports_credentials' => false,
];
