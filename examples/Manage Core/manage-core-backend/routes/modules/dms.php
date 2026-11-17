<?php

use App\Http\Controllers\Api\DmsAiController;
use App\Http\Controllers\Api\DmsArchiveController;
use App\Http\Controllers\Api\DmsCollaborationController;
use App\Http\Controllers\Api\DmsController;
use App\Http\Controllers\Api\DmsViewerController;
use Illuminate\Support\Facades\Route;

Route::get('/dms/stats', [DmsController::class, 'stats']);
Route::get('/dms/analytics', [DmsController::class, 'analytics']);
Route::get('/dms/search', [DmsController::class, 'search']);
Route::post('/dms/upload', [DmsController::class, 'upload']);

Route::get('/dms/folders', [DmsController::class, 'folders']);
Route::post('/dms/folders', [DmsController::class, 'storeFolder']);
Route::put('/dms/folders/{id}', [DmsController::class, 'updateFolder']);
Route::delete('/dms/folders/{id}', [DmsController::class, 'deleteFolder']);

Route::get('/dms/documents', [DmsController::class, 'documents']);
Route::post('/dms/documents', [DmsController::class, 'storeDocument']);
Route::get('/dms/documents/{id}', [DmsController::class, 'showDocument']);
Route::put('/dms/documents/{id}', [DmsController::class, 'updateDocument']);
Route::delete('/dms/documents/{id}', [DmsController::class, 'deleteDocument']);
Route::get('/dms/documents/{id}/download', [DmsController::class, 'downloadDocument']);
Route::get('/dms/documents/{id}/serve', [DmsController::class, 'serveFile']);

Route::get('/dms/documents/{documentId}/versions', [DmsController::class, 'documentVersions']);
Route::post('/dms/documents/{documentId}/versions', [DmsController::class, 'storeDocumentVersion']);
Route::post('/dms/documents/{documentId}/versions/{versionId}/restore', [DmsController::class, 'restoreDocumentVersion']);

Route::get('/dms/documents/{documentId}/signatures', [DmsController::class, 'documentSignatures']);
Route::post('/dms/documents/{documentId}/signatures', [DmsController::class, 'storeSignature']);
Route::patch('/dms/signatures/{id}', [DmsController::class, 'updateSignatureStatus']);

Route::get('/dms/documents/{documentId}/approvals', [DmsController::class, 'documentApprovals']);
Route::post('/dms/documents/{documentId}/approvals', [DmsController::class, 'storeApproval']);
Route::patch('/dms/approvals/{id}', [DmsController::class, 'updateApprovalStatus']);

Route::get('/dms/documents/{documentId}/comments', [DmsController::class, 'documentComments']);
Route::post('/dms/documents/{documentId}/comments', [DmsController::class, 'storeComment']);
Route::delete('/dms/comments/{id}', [DmsController::class, 'deleteComment']);

Route::get('/dms/documents/{documentId}/shares', [DmsController::class, 'documentShares']);
Route::post('/dms/documents/{documentId}/shares', [DmsController::class, 'storeShare']);
Route::delete('/dms/shares/{id}', [DmsController::class, 'revokeShare']);

Route::get('/dms/documents/{documentId}/audit-logs', [DmsController::class, 'documentAuditLogs']);
Route::get('/dms/audit-logs', [DmsController::class, 'auditLogs']);

Route::get('/dms/templates', [DmsController::class, 'templates']);
Route::post('/dms/templates', [DmsController::class, 'storeTemplate']);
Route::put('/dms/templates/{id}', [DmsController::class, 'updateTemplate']);
Route::delete('/dms/templates/{id}', [DmsController::class, 'deleteTemplate']);

Route::get('/dms/documents/{documentId}/ai-classification', [DmsAiController::class, 'classification']);
Route::post('/dms/documents/{documentId}/ai-analyze', [DmsAiController::class, 'analyze']);
Route::get('/dms/documents/{documentId}/summary', [DmsAiController::class, 'summary']);
Route::get('/dms/documents/{documentId}/compliance-check', [DmsAiController::class, 'complianceCheck']);
Route::get('/dms/ai/duplicates', [DmsAiController::class, 'duplicates']);
Route::get('/dms/ai/recommendations', [DmsAiController::class, 'recommendations']);
Route::post('/dms/ai/search', [DmsAiController::class, 'search']);

Route::get('/dms/archived', [DmsArchiveController::class, 'archived']);
Route::post('/dms/archived/{id}/restore', [DmsArchiveController::class, 'restore']);
Route::delete('/dms/archived/{id}/permanent-delete', [DmsArchiveController::class, 'permanentDelete']);
Route::get('/dms/retention-policies', [DmsArchiveController::class, 'retentionPolicies']);
Route::get('/dms/archive-stats', [DmsArchiveController::class, 'stats']);

Route::get('/dms/documents/{documentId}/discussions', [DmsCollaborationController::class, 'discussions']);
Route::post('/dms/documents/{documentId}/discussions', [DmsCollaborationController::class, 'createDiscussion']);
Route::post('/dms/discussions/{discussionId}/replies', [DmsCollaborationController::class, 'addReply']);
Route::get('/dms/documents/{documentId}/collab-tasks', [DmsCollaborationController::class, 'tasks']);
Route::post('/dms/documents/{documentId}/collab-tasks', [DmsCollaborationController::class, 'createTask']);
Route::put('/dms/collab-tasks/{taskId}', [DmsCollaborationController::class, 'updateTask']);

Route::get('/dms/documents/{documentId}/preview-url', [DmsViewerController::class, 'previewUrl']);
Route::get('/dms/documents/{documentId}/annotations', [DmsViewerController::class, 'annotations']);
Route::post('/dms/documents/{documentId}/annotations', [DmsViewerController::class, 'addAnnotation']);
Route::get('/dms/documents/{documentId}/compare', [DmsViewerController::class, 'compareVersions']);

Route::get('/dms/shared/{token}', [DmsController::class, 'accessSharedDocument']);
