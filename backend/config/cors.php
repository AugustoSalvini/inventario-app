<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],

    // Se usa patterns para permitir cualquier puerto dinámico
    'allowed_origins' => [],
    'allowed_origins_patterns' => [
        '#^http://localhost(:\d+)?$#',
        '#^http://127\.0\.0\.1(:\d+)?$#',
    ],

        'allowed_headers' => ['*'],
            'exposed_headers' => [],
     'max_age' => 0,
        'supports_credentials' => true,
];
