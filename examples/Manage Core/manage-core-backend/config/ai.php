<?php

return [
    'default_provider' => env('AI_PROVIDER', 'openrouter'),
    'openrouter' => [
        'api_key' => env('OPENROUTER_API_KEY'),
        'base_url' => 'https://openrouter.ai/api/v1',
        'default_model' => env('OPENROUTER_DEFAULT_MODEL', 'openrouter/free'),
        'timeout' => 120,
        'fallback_models' => [
            'google/gemma-4-26b-a4b-it:free',
            'openai/gpt-oss-20b:free',
            'nvidia/nemotron-3-super-120b-a12b:free',
        ],
    ],
    'models' => [
        'default' => env('OPENROUTER_DEFAULT_MODEL', 'openrouter/free'),
        'chat' => 'openrouter/free',
        'analysis' => 'google/gemma-4-26b-a4b-it:free',
        'classification' => 'google/gemma-4-26b-a4b-it:free',
        'summary' => 'google/gemma-4-26b-a4b-it:free',
    ],
];