<?php

use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\ApprovalController;
use App\Http\Controllers\Api\BackupController;
use App\Http\Controllers\Api\ChatChannelController;
use App\Http\Controllers\Api\ChatMeetingController;
use App\Http\Controllers\Api\ChatMessageController;
use App\Http\Controllers\Api\ChatRequestController;
use App\Http\Controllers\Api\CompanyLimitController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ESignatureController;
use App\Http\Controllers\Api\ImportExportController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\ReceiptController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\StorageLimitController;
use App\Http\Controllers\Api\SupportTicketController;
use App\Http\Controllers\Api\SystemSettingController;
use App\Http\Controllers\Api\ThemeAssignmentController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UserDocumentController;
use Illuminate\Support\Facades\Route;

Route::get('/announcements/stats', [AnnouncementController::class, 'stats']);
Route::get('/announcements/tenants', [AnnouncementController::class, 'tenants']);
Route::get('/announcements', [AnnouncementController::class, 'index']);
Route::post('/announcements', [AnnouncementController::class, 'store']);
Route::put('/announcements/{announcement}', [AnnouncementController::class, 'update']);
Route::delete('/announcements/{announcement}', [AnnouncementController::class, 'destroy']);
Route::post('/announcements/{announcement}/read', [AnnouncementController::class, 'markRead']);
Route::post('/announcements/{announcement}/acknowledge', [AnnouncementController::class, 'acknowledge']);

Route::get('/settings/storage', [SystemSettingController::class, 'showStorage']);
Route::patch('/settings/storage', [SystemSettingController::class, 'updateStorage']);

Route::get('/storage-limits', [StorageLimitController::class, 'index']);
Route::patch('/storage-limits/{user}', [StorageLimitController::class, 'update']);

Route::get('/company-limits/stats', [CompanyLimitController::class, 'stats']);
Route::post('/company-limits', [CompanyLimitController::class, 'store']);
Route::patch('/company-limits/{limit}', [CompanyLimitController::class, 'update']);

Route::get('/permissions', [PermissionController::class, 'index']);
Route::get('/permissions/list', [PermissionController::class, 'list']);

Route::get('/roles/dashboard-stats', [RoleController::class, 'dashboardStats']);
Route::post('/roles/purge-unused', [RoleController::class, 'purgeUnusedRoles']);
Route::apiResource('roles', RoleController::class)->middleware('auth:sanctum');

Route::get('/approvals/stats', [ApprovalController::class, 'stats']);
Route::apiResource('approvals', ApprovalController::class);
Route::post('/approvals/{approval}/comments', [ApprovalController::class, 'addComment']);

Route::get('/teams/stats', [\App\Http\Controllers\Api\TeamController::class, 'stats']);
Route::apiResource('teams', \App\Http\Controllers\Api\TeamController::class);

Route::post('/users/bulk-role-update', [UserController::class, 'bulkRoleUpdate']);
Route::patch('/users/{user}/permissions', [UserController::class, 'updatePermissions']);
Route::apiResource('users', UserController::class)
    ->only(['index', 'store', 'update', 'destroy', 'show'])
    ->middleware('auth:sanctum');
Route::get('/user/preferences', [UserController::class, 'getPreferences']);
Route::patch('/user/preferences', [UserController::class, 'updatePreferences']);

Route::get('/employees/{user}/profile', [\App\Http\Controllers\Api\EmployeeProfileController::class, 'show']);
Route::patch('/employees/{user}/profile', [\App\Http\Controllers\Api\EmployeeProfileController::class, 'update']);

Route::get('/users/{user}/documents', [UserDocumentController::class, 'index']);
Route::post('/users/{user}/documents', [UserDocumentController::class, 'store']);
Route::delete('/user-documents/{document}', [UserDocumentController::class, 'destroy']);
Route::get('/user-documents/{document}/download', [UserDocumentController::class, 'download']);

Route::get('/chat-requests', [ChatRequestController::class, 'index']);
Route::post('/chat-requests', [ChatRequestController::class, 'store']);
Route::post('/chat-requests/{chatRequest}/accept', [ChatRequestController::class, 'accept']);
Route::post('/chat-requests/{chatRequest}/reject', [ChatRequestController::class, 'reject']);
Route::get('/chat-sessions/{session}/messages', [ChatMessageController::class, 'index']);
Route::post('/chat-sessions/{session}/messages', [ChatMessageController::class, 'store']);
Route::post('/chat-sessions/{session}/clear', [ChatMessageController::class, 'clear']);
Route::delete('/chat-sessions/{session}', [ChatRequestController::class, 'disconnect']);

Route::get('/support/stats', [SupportTicketController::class, 'stats']);
Route::get('/support/conversations', [SupportTicketController::class, 'conversations']);
Route::post('/support/conversations', [SupportTicketController::class, 'createConversation']);
Route::get('/support/conversations/{conversation}', [SupportTicketController::class, 'showConversation']);
Route::post('/support/conversations/{conversation}/messages', [SupportTicketController::class, 'addMessage']);
Route::post('/support/conversations/{conversation}/participants', [SupportTicketController::class, 'addParticipant']);
Route::patch('/support/conversations/{conversation}/status', [SupportTicketController::class, 'updateConversationStatus']);
Route::get('/support/users', [SupportTicketController::class, 'availableUsers']);

Route::get('/clients/stats', [\App\Http\Controllers\Api\ClientController::class, 'stats']);
Route::apiResource('clients', \App\Http\Controllers\Api\ClientController::class);

Route::get('/customers/stats', [CustomerController::class, 'statistics']);
Route::post('/customers/{customerId}/contacts', [CustomerController::class, 'addContact']);
Route::apiResource('customers', CustomerController::class);

// Public share tokens (QR codes for customers, receipts, etc.)
Route::post('/public-shares', [\App\Http\Controllers\Api\PublicShareController::class, 'createShare']);
Route::delete('/public-shares', [\App\Http\Controllers\Api\PublicShareController::class, 'revokeShare']);

Route::apiResource('receipts', ReceiptController::class);

Route::get('/theme-configs', [ThemeAssignmentController::class, 'getConfigs']);
Route::post('/theme-configs', [ThemeAssignmentController::class, 'storeConfig']);
Route::put('/theme-configs/{id}', [ThemeAssignmentController::class, 'updateConfig']);
Route::delete('/theme-configs/{id}', [ThemeAssignmentController::class, 'deleteConfig']);
Route::get('/theme-assignments', [ThemeAssignmentController::class, 'getAssignments']);
Route::post('/theme-assignments', [ThemeAssignmentController::class, 'storeAssignment']);
Route::delete('/theme-assignments/{id}', [ThemeAssignmentController::class, 'deleteAssignment']);
Route::get('/theme-logs', [ThemeAssignmentController::class, 'getLogs']);
Route::get('/active-theme', [ThemeAssignmentController::class, 'getActiveTheme']);
Route::get('/theme-users', [ThemeAssignmentController::class, 'getUsers']);
Route::get('/theme-roles', [ThemeAssignmentController::class, 'getRoles']);
Route::get('/theme-departments', [ThemeAssignmentController::class, 'getDepartments']);
Route::get('/theme-teams', [ThemeAssignmentController::class, 'getTeams']);

Route::post('/import', [ImportExportController::class, 'import']);
Route::post('/export', [ImportExportController::class, 'export']);

Route::get('/reports/stats', [ReportController::class, 'stats']);
Route::post('/reports/{schedule}/toggle', [ReportController::class, 'toggle']);
Route::apiResource('reports', \App\Http\Controllers\Api\ReportController::class);

Route::get('/backups/stats', [BackupController::class, 'stats']);
Route::post('/backups/run', [BackupController::class, 'run']);
Route::get('/backups', [BackupController::class, 'index']);
Route::get('/backups/export/{format}', [BackupController::class, 'export']);

Route::get('/signatures/stats', [ESignatureController::class, 'stats']);
Route::post('/signatures/sign/{signer}', [ESignatureController::class, 'sign']);
Route::apiResource('signatures', ESignatureController::class);

Route::get('/notifications/{role?}', [NotificationController::class, 'index']);
Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

// ── Chat Channels ────────────────────────────────────────
Route::get('/chat/channels', [ChatChannelController::class, 'index']);
Route::post('/chat/channels', [ChatChannelController::class, 'store']);
Route::get('/chat/channels/{channel}', [ChatChannelController::class, 'show']);
Route::patch('/chat/channels/{channel}', [ChatChannelController::class, 'update']);
Route::delete('/chat/channels/{channel}', [ChatChannelController::class, 'destroy']);
Route::post('/chat/channels/{channel}/members', [ChatChannelController::class, 'addMember']);
Route::delete('/chat/channels/{channel}/members/{userId}', [ChatChannelController::class, 'removeMember']);
Route::get('/chat/channels/{channel}/messages', [ChatChannelController::class, 'messages']);
Route::post('/chat/channels/{channel}/messages', [ChatChannelController::class, 'storeMessage']);

// ── Chat Search, Files, Presence, Metrics, Approvals ─────
Route::get('/chat/search', [ChatChannelController::class, 'search']);
Route::post('/chat/files/upload', [ChatChannelController::class, 'upload']);
Route::get('/chat/files', [ChatChannelController::class, 'files']);
Route::post('/chat/presence', [ChatChannelController::class, 'presence']);
Route::get('/chat/presence', [ChatChannelController::class, 'getPresence']);
Route::get('/chat/collaboration/metrics', [ChatChannelController::class, 'collaborationMetrics']);
Route::get('/chat/approvals', [ChatChannelController::class, 'approvals']);
Route::post('/chat/approvals', [ChatChannelController::class, 'approvals']);
Route::patch('/chat/approvals/{id}', [ChatChannelController::class, 'updateApproval']);

// ── Chat Meetings ────────────────────────────────────────
Route::get('/chat/meetings', [ChatMeetingController::class, 'index']);
Route::post('/chat/meetings', [ChatMeetingController::class, 'store']);
Route::get('/chat/meetings/{meeting}', [ChatMeetingController::class, 'show']);
Route::patch('/chat/meetings/{meeting}', [ChatMeetingController::class, 'update']);
Route::delete('/chat/meetings/{meeting}', [ChatMeetingController::class, 'destroy']);
Route::get('/chat/meetings/{meeting}/recording', [ChatMeetingController::class, 'recording']);
Route::post('/chat/meetings/{meeting}/recording', [ChatMeetingController::class, 'updateRecording']);
