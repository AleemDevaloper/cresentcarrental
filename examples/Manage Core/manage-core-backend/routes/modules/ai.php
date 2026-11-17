<?php

use App\Http\Controllers\Api\AiChatController;
use App\Http\Controllers\Api\AiProviderController;
use App\Http\Controllers\Api\AiQuotaController;
use App\Http\Controllers\Api\AiTrainingController;
use Illuminate\Support\Facades\Route;

Route::post('/ai/chat', [AiChatController::class, 'chat']);
Route::get('/ai/chat/{sessionId}/summary', [AiChatController::class, 'summary']);
Route::get('/ai/chat/{sessionId}/action-items', [AiChatController::class, 'actionItems']);
Route::post('/ai/translate', [AiChatController::class, 'translate']);
Route::get('/ai/chat/{sessionId}/suggest', [AiChatController::class, 'suggest']);

Route::get('/ai/providers', [AiProviderController::class, 'index']);
Route::post('/ai/providers', [AiProviderController::class, 'store']);
Route::patch('/ai/providers/{provider}', [AiProviderController::class, 'update']);
Route::delete('/ai/providers/{provider}', [AiProviderController::class, 'destroy']);
Route::post('/ai/providers/{provider}/test', [AiProviderController::class, 'test']);
Route::get('/ai/providers/models', [AiProviderController::class, 'models']);
Route::get('/ai/usage', [AiProviderController::class, 'usage']);

Route::get('/ai/quotas', [AiQuotaController::class, 'index']);
Route::post('/ai/quotas', [AiQuotaController::class, 'store']);
Route::patch('/ai/quotas/{quota}', [AiQuotaController::class, 'update']);

// AI Training Center
Route::get('/ai/training/dashboard', [AiTrainingController::class, 'dashboardStats']);
Route::get('/ai/training/models', [AiTrainingController::class, 'listModels']);
Route::post('/ai/training/models', [AiTrainingController::class, 'createModel']);
Route::patch('/ai/training/models/{id}', [AiTrainingController::class, 'updateModel']);
Route::delete('/ai/training/models/{id}', [AiTrainingController::class, 'deleteModel']);

Route::get('/ai/training/models/{modelId}/datasets', [AiTrainingController::class, 'listDatasets']);
Route::post('/ai/training/models/{modelId}/datasets', [AiTrainingController::class, 'uploadDataset']);
Route::delete('/ai/training/models/{modelId}/datasets/{datasetId}', [AiTrainingController::class, 'deleteDataset']);

Route::post('/ai/training/models/{modelId}/start', [AiTrainingController::class, 'startTraining']);
Route::get('/ai/training/models/{modelId}/status', [AiTrainingController::class, 'trainingStatus']);
Route::post('/ai/training/models/{modelId}/stop', [AiTrainingController::class, 'stopTraining']);
Route::get('/ai/training/models/{modelId}/sessions', [AiTrainingController::class, 'listSessions']);

Route::get('/ai/training/agents', [AiTrainingController::class, 'listAgents']);
Route::post('/ai/training/agents', [AiTrainingController::class, 'createAgent']);
Route::patch('/ai/training/agents/{id}', [AiTrainingController::class, 'updateAgent']);
Route::delete('/ai/training/agents/{id}', [AiTrainingController::class, 'deleteAgent']);
