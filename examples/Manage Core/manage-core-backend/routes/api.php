<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Middleware\CustomerDataIsolationMiddleware;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::get('/login', function () {
        return response()->json(['message' => 'Unauthenticated.'], 401);
    })->name('login');

    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Public (no auth) — shared invoice access via token
    Route::get('/public/invoices/{token}', [\App\Http\Controllers\Api\FmsController::class, 'getPublicSalesInvoice']);
    Route::get('/public/invoice/{token}', [\App\Http\Controllers\Api\FmsController::class, 'getPublicSalesInvoice']);

    // Public (no auth) — generic public share tokens for customers, receipts, invoices, etc.
    Route::get('/public/share/{entityType}/{token}', [\App\Http\Controllers\Api\PublicShareController::class, 'getPublicEntity']);

    // Public (no auth) — marketing website form submissions
    Route::post('/public/website/demo', [\App\Http\Controllers\Api\WebsiteLeadController::class, 'storeDemo']);
    Route::post('/public/website/contact', [\App\Http\Controllers\Api\WebsiteLeadController::class, 'storeContact']);

    Route::middleware('auth:sanctum')->middleware(CustomerDataIsolationMiddleware::class)->group(function () {
        require __DIR__ . '/modules/auth.php';
        require __DIR__ . '/modules/common.php';
        require __DIR__ . '/modules/projects.php';
        require __DIR__ . '/modules/hrms.php';
        require __DIR__ . '/modules/dms.php';
        require __DIR__ . '/modules/mfg.php';
        require __DIR__ . '/modules/fms.php';
        require __DIR__ . '/modules/erp.php';
        require __DIR__ . '/modules/ai.php';
        require __DIR__ . '/modules/superadmin.php';
        require __DIR__ . '/modules/ems.php';
        require __DIR__ . '/modules/crm.php';
    });
});
