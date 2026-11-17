<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::any('{any}', function (Request $request) {
    $host = $request->getHost();
    $path = $request->path();
    
    // Determine if this is a request for the company software (app)
    $isApp = false;
    
    // 1. If it's a subdomain (e.g. not the main marketing domains)
    $mainDomains = ['managecore.asiancon.com', 'managecore.local', 'localhost', '127.0.0.1'];
    if (!in_array($host, $mainDomains)) {
        $isApp = true;
    }
    
    // 2. Or if the path matches software-specific entry points or starts with /app
    $appPaths = ['login', 'register', 'dashboard', 'superadmin', 'systems', 'permissions', 'admin', 'profile', 'settings', 'app'];
    $firstSegment = explode('/', $path)[0];
    if (in_array($firstSegment, $appPaths)) {
        $isApp = true;
    }
    
    // Serve the corresponding index.html
    if ($isApp) {
        $appIndexPath = public_path('app/index.html');
        if (file_exists($appIndexPath)) {
            return file_get_contents($appIndexPath);
        }
    }
    
    // Fallback to the main marketing website index.html
    return file_get_contents(public_path('index.html'));
})->where('any', '.*');
