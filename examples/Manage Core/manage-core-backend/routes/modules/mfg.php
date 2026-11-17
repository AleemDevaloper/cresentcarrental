<?php

use App\Http\Controllers\Api\MfgController;
use Illuminate\Support\Facades\Route;

Route::get('/mfg/dashboard', [MfgController::class, 'dashboard']);
Route::get('/mfg/production-orders', [MfgController::class, 'listProductionOrders']);
Route::get('/mfg/production-orders/{id}', [MfgController::class, 'getProductionOrder']);
Route::post('/mfg/production-orders', [MfgController::class, 'createProductionOrder']);
Route::put('/mfg/production-orders/{id}', [MfgController::class, 'updateProductionOrder']);
Route::delete('/mfg/production-orders/{id}', [MfgController::class, 'deleteProductionOrder']);
Route::get('/mfg/boms', [MfgController::class, 'listBoms']);
Route::get('/mfg/boms/{id}', [MfgController::class, 'getBom']);
Route::post('/mfg/boms', [MfgController::class, 'createBom']);
Route::put('/mfg/boms/{id}', [MfgController::class, 'updateBom']);
Route::delete('/mfg/boms/{id}', [MfgController::class, 'deleteBom']);
Route::get('/mfg/work-orders', [MfgController::class, 'listWorkOrders']);
Route::get('/mfg/work-orders/{id}', [MfgController::class, 'getWorkOrder']);
Route::post('/mfg/work-orders', [MfgController::class, 'createWorkOrder']);
Route::put('/mfg/work-orders/{id}', [MfgController::class, 'updateWorkOrder']);
Route::delete('/mfg/work-orders/{id}', [MfgController::class, 'deleteWorkOrder']);
Route::get('/mfg/machine-utilization', [MfgController::class, 'machineUtilization']);
Route::get('/mfg/material-consumption', [MfgController::class, 'materialConsumption']);
Route::get('/mfg/production-timeline', [MfgController::class, 'productionTimeline']);
Route::get('/mfg/low-stock-alerts', [MfgController::class, 'lowStockAlerts']);
