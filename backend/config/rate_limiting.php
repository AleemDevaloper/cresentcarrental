<?php

return [

    'default' => env('RATE_LIMITER', 'api'),

    'api' => [
        'driver' => 'fixed_window',
        'rate' => 60,
        'decay_minutes' => 1,
        'key' => fn ($request) => $request->user()?->id ?: $request->ip(),
    ],

    'login' => [
        'driver' => 'fixed_window',
        'rate' => 6,
        'decay_minutes' => 1,
        'key' => fn ($request) => $request->input('email') ?: $request->ip(),
    ],

];
