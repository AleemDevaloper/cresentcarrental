<?php

use App\Http\Controllers\Api\SuperAdmin\GovernanceController;
use App\Http\Controllers\Api\SuperAdmin\ModuleAnalyticsController;
use App\Http\Controllers\Api\SuperAdmin\ModuleAssignmentController;
use App\Http\Controllers\Api\SuperAdmin\ModuleController;
use App\Http\Controllers\Api\SuperAdmin\SuperAdminCustomerController;
use App\Http\Controllers\Api\IntegrationController;
use App\Http\Controllers\Api\TenantController;
use App\Http\Controllers\Api\WebsiteLeadController;
use Illuminate\Support\Facades\Route;

Route::middleware('superadmin')->group(function () {
Route::prefix('super-admin')->group(function () {
    Route::get('/modules/stats', [ModuleAnalyticsController::class, 'dashboardStats']);
    Route::get('/modules/trends', [ModuleAnalyticsController::class, 'usageTrends']);
    Route::apiResource('modules', ModuleController::class);
    Route::post('/modules/{module}/features', [ModuleController::class, 'addFeature']);
    Route::patch('/module-features/{feature}', [ModuleController::class, 'updateFeature']);
    Route::delete('/module-features/{feature}', [ModuleController::class, 'destroyFeature']);

    Route::get('/module-assignments', [ModuleAssignmentController::class, 'index']);
    Route::post('/module-assignments', [ModuleAssignmentController::class, 'assign']);
    Route::delete('/module-assignments', [ModuleAssignmentController::class, 'remove']);
    Route::post('/module-assignments/toggle-feature', [ModuleAssignmentController::class, 'toggleTenantFeature']);
    Route::get('/tenants/{tenant}/modules', [ModuleAssignmentController::class, 'getTenantModules']);

    Route::get('/customers/stats', [SuperAdminCustomerController::class, 'statistics']);
    Route::apiResource('customers', SuperAdminCustomerController::class);
    Route::post('/customers/{customerId}/contacts', [SuperAdminCustomerController::class, 'addContact']);

    // Website leads (demo requests & contact messages from marketing site)
    Route::get('/website/demo-requests', [WebsiteLeadController::class, 'listDemoRequests']);
    Route::patch('/website/demo-requests/{id}', [WebsiteLeadController::class, 'updateDemoRequest']);
    Route::delete('/website/demo-requests/{id}', [WebsiteLeadController::class, 'deleteDemoRequest']);
    Route::get('/website/contact-messages', [WebsiteLeadController::class, 'listContactMessages']);
    Route::patch('/website/contact-messages/{id}', [WebsiteLeadController::class, 'updateContactMessage']);
    Route::delete('/website/contact-messages/{id}', [WebsiteLeadController::class, 'deleteContactMessage']);

    Route::prefix('governance')->group(function () {
        Route::get('/overview', [GovernanceController::class, 'overview']);
        Route::get('/modules', [GovernanceController::class, 'modules']);
        Route::post('/modules/{module}/status', [GovernanceController::class, 'updateModuleStatus']);
        Route::post('/modules/{module}/clone', [GovernanceController::class, 'cloneModule']);
        Route::get('/features', [GovernanceController::class, 'features']);
        Route::patch('/features/{feature}', [GovernanceController::class, 'updateFeature']);
        Route::get('/feature-flags', [GovernanceController::class, 'featureFlags']);
        Route::post('/feature-flags', [GovernanceController::class, 'createFeatureFlag']);
        Route::patch('/feature-flags/{id}', [GovernanceController::class, 'updateFeatureFlag']);
        Route::get('/licenses', [GovernanceController::class, 'licenses']);
        Route::get('/roles', [GovernanceController::class, 'roles']);
        Route::get('/permissions', [GovernanceController::class, 'permissions']);
        Route::get('/data-access', [GovernanceController::class, 'dataAccess']);
        Route::get('/security', [GovernanceController::class, 'security']);
        Route::get('/sessions', [GovernanceController::class, 'sessions']);
        Route::post('/sessions/{id}/terminate', [GovernanceController::class, 'terminateSession']);
        Route::get('/approval-workflows', [GovernanceController::class, 'approvalWorkflows']);
        Route::get('/audit-logs', [GovernanceController::class, 'auditLogs']);
        Route::get('/impersonations', [GovernanceController::class, 'impersonations']);
        Route::post('/impersonate', [GovernanceController::class, 'impersonate']);
        Route::get('/health', [GovernanceController::class, 'health']);
        Route::get('/ai', [GovernanceController::class, 'aiGovernance']);
        Route::patch('/ai/{id}', [GovernanceController::class, 'updateAI']);
        Route::get('/command-center', [GovernanceController::class, 'commandCenter']);
    });
});

Route::post('/tenants/provision', [TenantController::class, 'provision']);
Route::put('/tenants/{tenant}/systems', [TenantController::class, 'syncSystems']);
Route::get('/tenants/{tenant}/users', [TenantController::class, 'users']);
Route::post('/tenants/{tenant}/users', [TenantController::class, 'storeUser']);
Route::get('/tenants/{tenant}/users/{user}', [TenantController::class, 'showUser']);
Route::put('/tenants/{tenant}/users/{user}', [TenantController::class, 'updateUser']);
Route::delete('/tenants/{tenant}/users/{user}', [TenantController::class, 'destroyUser']);
Route::post('/tenants/{tenant}/users/{user}/reset-password', [TenantController::class, 'resetPassword']);
Route::put('/tenants/{tenant}/users/{user}/systems', [TenantController::class, 'syncUserSystems']);
Route::apiResource('tenants', TenantController::class);
    Route::get('/integrations/keys', [IntegrationController::class, 'listApiKeys']);
    Route::post('/integrations/keys', [IntegrationController::class, 'storeApiKey']);
    Route::post('/integrations/keys/{apiKey}/toggle', [IntegrationController::class, 'toggleApiKey']);
    Route::delete('/integrations/keys/{apiKey}', [IntegrationController::class, 'destroyApiKey']);
    Route::get('/integrations/webhooks', [IntegrationController::class, 'listWebhooks']);
    Route::post('/integrations/webhooks', [IntegrationController::class, 'storeWebhook']);
    Route::post('/integrations/webhooks/{webhook}/toggle', [IntegrationController::class, 'toggleWebhook']);
    Route::delete('/integrations/webhooks/{webhook}', [IntegrationController::class, 'destroyWebhook']);
});
