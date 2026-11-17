<?php

use App\Http\Controllers\Api\CrmController;
use App\Http\Controllers\Api\CrmEmailController;
use App\Http\Controllers\Api\CrmFollowUpController;
use App\Http\Controllers\Api\CrmSequenceController;
use App\Http\Controllers\Api\CrmAutomationController;
use App\Http\Controllers\Api\CrmTagController;
use App\Http\Controllers\Api\CrmCustomFieldController;
use App\Http\Controllers\Api\CrmAuditController;
use App\Http\Controllers\Api\CrmDocumentController;
use App\Http\Controllers\Api\CrmNotificationController;
use App\Http\Controllers\Api\CrmCalendarController;
use App\Http\Controllers\Api\CrmDuplicateController;
use App\Http\Controllers\Api\CrmImportExportController;
use App\Http\Controllers\Api\CrmLeadScoreController;
use App\Http\Controllers\Api\CrmAnalyticsController;
use Illuminate\Support\Facades\Route;

// Dashboard
Route::get('/crm/dashboard', [CrmController::class, 'dashboard']);
Route::get('/crm/analytics/dashboard', [CrmAnalyticsController::class, 'dashboard']);
Route::get('/crm/analytics/search', [CrmAnalyticsController::class, 'search']);

// Reports
Route::get('/crm/reports/pipeline', [CrmAnalyticsController::class, 'pipelineReport']);
Route::get('/crm/reports/conversion', [CrmAnalyticsController::class, 'conversionReport']);
Route::get('/crm/reports/activities', [CrmAnalyticsController::class, 'activityReport']);
Route::get('/crm/reports/performers', [CrmAnalyticsController::class, 'performanceReport']);
Route::get('/crm/reports/revenue-by-source', [CrmAnalyticsController::class, 'sourceReport']);
Route::get('/crm/reports/leads', [CrmAnalyticsController::class, 'leadReport']);
Route::get('/crm/reports/deals', [CrmAnalyticsController::class, 'dealReport']);
Route::get('/crm/reports/emails', [CrmAnalyticsController::class, 'emailReport']);
Route::get('/crm/reports/campaigns', [CrmAnalyticsController::class, 'campaignReport']);
Route::get('/crm/reports/follow-ups', [CrmAnalyticsController::class, 'followUpReport']);

// Customers
Route::get('/crm/customers', [CrmController::class, 'indexCustomers']);
Route::post('/crm/customers', [CrmController::class, 'storeCustomer']);
Route::get('/crm/customers/{id}', [CrmController::class, 'showCustomer']);
Route::put('/crm/customers/{id}', [CrmController::class, 'updateCustomer']);
Route::delete('/crm/customers/{id}', [CrmController::class, 'destroyCustomer']);

// Leads
Route::get('/crm/leads', [CrmController::class, 'indexLeads']);
Route::post('/crm/leads', [CrmController::class, 'storeLead']);
Route::get('/crm/leads/{id}', [CrmController::class, 'showLead']);
Route::put('/crm/leads/{id}', [CrmController::class, 'updateLead']);
Route::delete('/crm/leads/{id}', [CrmController::class, 'destroyLead']);
Route::post('/crm/leads/{id}/convert', [CrmController::class, 'convertLead']);
Route::post('/crm/leads/import', [CrmController::class, 'importLeads']);

// Contacts
Route::get('/crm/contacts', [CrmController::class, 'indexContacts']);
Route::post('/crm/contacts', [CrmController::class, 'storeContact']);
Route::get('/crm/contacts/{id}', [CrmController::class, 'showContact']);
Route::put('/crm/contacts/{id}', [CrmController::class, 'updateContact']);
Route::delete('/crm/contacts/{id}', [CrmController::class, 'destroyContact']);

// Pipelines
Route::get('/crm/pipelines', [CrmController::class, 'pipelines']);
Route::post('/crm/pipelines', [CrmController::class, 'storePipeline']);
Route::put('/crm/pipelines/{id}', [CrmController::class, 'updatePipeline']);
Route::delete('/crm/pipelines/{id}', [CrmController::class, 'destroyPipeline']);

// Deals
Route::get('/crm/deals', [CrmController::class, 'indexDeals']);
Route::post('/crm/deals', [CrmController::class, 'storeDeal']);
Route::get('/crm/deals/{id}', [CrmController::class, 'showDeal']);
Route::put('/crm/deals/{id}', [CrmController::class, 'updateDeal']);
Route::delete('/crm/deals/{id}', [CrmController::class, 'destroyDeal']);
Route::post('/crm/deals/{id}/stage', [CrmController::class, 'moveStage']);
Route::post('/crm/deals/{id}/won', [CrmController::class, 'markWon']);
Route::post('/crm/deals/{id}/lost', [CrmController::class, 'markLost']);

// Activities
Route::get('/crm/activities', [CrmController::class, 'indexActivities']);
Route::post('/crm/activities', [CrmController::class, 'storeActivity']);
Route::get('/crm/activities/{id}', [CrmController::class, 'showActivity']);
Route::put('/crm/activities/{id}', [CrmController::class, 'updateActivity']);
Route::post('/crm/activities/{id}/complete', [CrmController::class, 'completeActivity']);
Route::delete('/crm/activities/{id}', [CrmController::class, 'destroyActivity']);

// Campaigns
Route::get('/crm/campaigns', [CrmController::class, 'indexCampaigns']);
Route::post('/crm/campaigns', [CrmController::class, 'storeCampaign']);
Route::get('/crm/campaigns/{id}', [CrmController::class, 'showCampaign']);
Route::put('/crm/campaigns/{id}', [CrmController::class, 'updateCampaign']);
Route::delete('/crm/campaigns/{id}', [CrmController::class, 'destroyCampaign']);

// Notes
Route::get('/crm/notes', [CrmController::class, 'indexNotes']);
Route::post('/crm/notes', [CrmController::class, 'storeNote']);
Route::put('/crm/notes/{id}', [CrmController::class, 'updateNote']);
Route::delete('/crm/notes/{id}', [CrmController::class, 'destroyNote']);

// Tasks
Route::get('/crm/tasks', [CrmController::class, 'indexTasks']);
Route::post('/crm/tasks', [CrmController::class, 'storeTask']);
Route::put('/crm/tasks/{id}', [CrmController::class, 'updateTask']);
Route::post('/crm/tasks/{id}/complete', [CrmController::class, 'completeTask']);
Route::delete('/crm/tasks/{id}', [CrmController::class, 'destroyTask']);

// ===== Email Accounts =====
Route::get('/crm/email/accounts', [CrmEmailController::class, 'indexAccounts']);
Route::post('/crm/email/accounts', [CrmEmailController::class, 'storeAccount']);
Route::get('/crm/email/accounts/{id}', [CrmEmailController::class, 'showAccount']);
Route::put('/crm/email/accounts/{id}', [CrmEmailController::class, 'updateAccount']);
Route::delete('/crm/email/accounts/{id}', [CrmEmailController::class, 'destroyAccount']);
Route::post('/crm/email/accounts/{id}/sync', [CrmEmailController::class, 'syncAccount']);
Route::post('/crm/email/accounts/{id}/pause', [CrmEmailController::class, 'pauseSync']);
Route::post('/crm/email/accounts/{id}/resume', [CrmEmailController::class, 'resumeSync']);
Route::post('/crm/email/accounts/{id}/test', [CrmEmailController::class, 'testAccount']);
Route::get('/crm/email/oauth-url', [CrmEmailController::class, 'getOAuthUrl']);

// ===== Email Inbox / Composer =====
Route::get('/crm/emails', [CrmEmailController::class, 'inbox']);
Route::get('/crm/emails/folder-stats', [CrmEmailController::class, 'folderStats']);
Route::post('/crm/emails', [CrmEmailController::class, 'sendEmail']);
Route::get('/crm/emails/{id}', [CrmEmailController::class, 'showEmail']);
Route::post('/crm/emails/{id}/reply', [CrmEmailController::class, 'replyEmail']);
Route::put('/crm/emails/{id}', [CrmEmailController::class, 'updateEmail']);
Route::delete('/crm/emails/{id}', [CrmEmailController::class, 'destroyEmail']);
Route::post('/crm/emails/bulk-action', [CrmEmailController::class, 'bulkEmailAction']);
Route::post('/crm/emails/create-from-record', [CrmEmailController::class, 'createFromRecord']);

// ===== Threads =====
Route::get('/crm/email/threads', [CrmEmailController::class, 'indexThreads']);
Route::get('/crm/email/threads/{id}', [CrmEmailController::class, 'showThread']);

// ===== Email Templates =====
Route::get('/crm/email/templates', [CrmEmailController::class, 'indexTemplates']);
Route::post('/crm/email/templates', [CrmEmailController::class, 'storeTemplate']);
Route::put('/crm/email/templates/{id}', [CrmEmailController::class, 'updateTemplate']);
Route::delete('/crm/email/templates/{id}', [CrmEmailController::class, 'destroyTemplate']);
Route::post('/crm/email/templates/{id}/duplicate', [CrmEmailController::class, 'duplicateTemplate']);
Route::post('/crm/email/templates/{id}/preview', [CrmEmailController::class, 'previewTemplate']);

// ===== Email Signatures =====
Route::get('/crm/email/signatures', [CrmEmailController::class, 'indexSignatures']);
Route::post('/crm/email/signatures', [CrmEmailController::class, 'storeSignature']);
Route::put('/crm/email/signatures/{id}', [CrmEmailController::class, 'updateSignature']);
Route::delete('/crm/email/signatures/{id}', [CrmEmailController::class, 'destroySignature']);

// ===== Email Tracking (public) =====
Route::get('/crm/track/open/{id}', [CrmEmailController::class, 'trackOpen']);
Route::get('/crm/track/click/{id}', [CrmEmailController::class, 'trackClick']);

// ===== Webhooks (public) =====
Route::post('/crm/webhooks/gmail', [CrmEmailController::class, 'gmailWebhook']);
Route::post('/crm/webhooks/microsoft', [CrmEmailController::class, 'microsoftWebhook']);
Route::get('/crm/webhooks', [CrmEmailController::class, 'indexWebhooks']);

// ===== Follow-ups =====
Route::get('/crm/followups', [CrmFollowUpController::class, 'index']);
Route::get('/crm/followups/stats', [CrmFollowUpController::class, 'stats']);
Route::post('/crm/followups', [CrmFollowUpController::class, 'store']);
Route::get('/crm/followups/{id}', [CrmFollowUpController::class, 'show']);
Route::put('/crm/followups/{id}', [CrmFollowUpController::class, 'update']);
Route::post('/crm/followups/{id}/complete', [CrmFollowUpController::class, 'complete']);
Route::post('/crm/followups/{id}/snooze', [CrmFollowUpController::class, 'snooze']);
Route::post('/crm/followups/{id}/reschedule', [CrmFollowUpController::class, 'reschedule']);
Route::post('/crm/followups/{id}/cancel', [CrmFollowUpController::class, 'cancel']);
Route::delete('/crm/followups/{id}', [CrmFollowUpController::class, 'destroy']);

// ===== Sequences =====
Route::get('/crm/sequences', [CrmSequenceController::class, 'index']);
Route::post('/crm/sequences', [CrmSequenceController::class, 'store']);
Route::get('/crm/sequences/{id}', [CrmSequenceController::class, 'show']);
Route::put('/crm/sequences/{id}', [CrmSequenceController::class, 'update']);
Route::delete('/crm/sequences/{id}', [CrmSequenceController::class, 'destroy']);
Route::post('/crm/sequences/{id}/steps', [CrmSequenceController::class, 'addStep']);
Route::delete('/crm/sequences/{id}/steps/{stepId}', [CrmSequenceController::class, 'removeStep']);
Route::post('/crm/sequences/{id}/enroll', [CrmSequenceController::class, 'enroll']);
Route::post('/crm/sequences/{id}/bulk-enroll', [CrmSequenceController::class, 'bulkEnroll']);
Route::get('/crm/sequences/{id}/enrollments', [CrmSequenceController::class, 'indexEnrollments']);
Route::post('/crm/sequences/enrollments/{enrollmentId}/stop', [CrmSequenceController::class, 'stopEnrollment']);
Route::post('/crm/sequences/{id}/pause', [CrmSequenceController::class, 'pauseSequence']);
Route::post('/crm/sequences/{id}/resume', [CrmSequenceController::class, 'resumeSequence']);
Route::get('/crm/sequences/{id}/stats', [CrmSequenceController::class, 'stats']);

// ===== Automations =====
Route::get('/crm/automations', [CrmAutomationController::class, 'index']);
Route::post('/crm/automations', [CrmAutomationController::class, 'store']);
Route::get('/crm/automations/{id}', [CrmAutomationController::class, 'show']);
Route::put('/crm/automations/{id}', [CrmAutomationController::class, 'update']);
Route::delete('/crm/automations/{id}', [CrmAutomationController::class, 'destroy']);
Route::post('/crm/automations/{id}/toggle', [CrmAutomationController::class, 'toggle']);
Route::post('/crm/automations/{id}/run', [CrmAutomationController::class, 'runNow']);
Route::get('/crm/automations/{id}/runs', [CrmAutomationController::class, 'indexRuns']);

// ===== Tags =====
Route::get('/crm/tags', [CrmTagController::class, 'index']);
Route::get('/crm/tags/all', [CrmTagController::class, 'all']);
Route::post('/crm/tags', [CrmTagController::class, 'store']);
Route::put('/crm/tags/{id}', [CrmTagController::class, 'update']);
Route::delete('/crm/tags/{id}', [CrmTagController::class, 'destroy']);
Route::post('/crm/tags/attach', [CrmTagController::class, 'attach']);
Route::post('/crm/tags/detach', [CrmTagController::class, 'detach']);

// ===== Custom Fields =====
Route::get('/crm/custom-fields', [CrmCustomFieldController::class, 'index']);
Route::post('/crm/custom-fields', [CrmCustomFieldController::class, 'store']);
Route::put('/crm/custom-fields/{id}', [CrmCustomFieldController::class, 'update']);
Route::delete('/crm/custom-fields/{id}', [CrmCustomFieldController::class, 'destroy']);
Route::post('/crm/custom-fields/values', [CrmCustomFieldController::class, 'saveValues']);
Route::get('/crm/custom-fields/values', [CrmCustomFieldController::class, 'getValues']);

// ===== Audit Logs =====
Route::get('/crm/audit', [CrmAuditController::class, 'index']);
Route::get('/crm/audit/{id}', [CrmAuditController::class, 'show']);
Route::get('/crm/audit/timeline/{entityType}/{entityId}', [CrmAuditController::class, 'entityTimeline']);

// ===== Documents =====
Route::get('/crm/documents', [CrmDocumentController::class, 'index']);
Route::post('/crm/documents', [CrmDocumentController::class, 'store']);
Route::get('/crm/documents/{id}', [CrmDocumentController::class, 'show']);
Route::put('/crm/documents/{id}', [CrmDocumentController::class, 'update']);
Route::delete('/crm/documents/{id}', [CrmDocumentController::class, 'destroy']);
Route::get('/crm/documents/{id}/download', [CrmDocumentController::class, 'download']);

// ===== Notifications =====
Route::get('/crm/notifications', [CrmNotificationController::class, 'index']);
Route::get('/crm/notifications/unread-count', [CrmNotificationController::class, 'unreadCount']);
Route::post('/crm/notifications/mark-all-read', [CrmNotificationController::class, 'markAllRead']);
Route::post('/crm/notifications/{id}/read', [CrmNotificationController::class, 'markRead']);
Route::delete('/crm/notifications/{id}', [CrmNotificationController::class, 'destroy']);

// ===== Calendar =====
Route::get('/crm/calendar/events', [CrmCalendarController::class, 'index']);
Route::get('/crm/calendar/month', [CrmCalendarController::class, 'monthView']);
Route::post('/crm/calendar/events', [CrmCalendarController::class, 'store']);
Route::put('/crm/calendar/events/{id}', [CrmCalendarController::class, 'update']);
Route::delete('/crm/calendar/events/{id}', [CrmCalendarController::class, 'destroy']);

// ===== Duplicates =====
Route::get('/crm/duplicates', [CrmDuplicateController::class, 'index']);
Route::post('/crm/duplicates/scan', [CrmDuplicateController::class, 'scan']);
Route::get('/crm/duplicates/{id}', [CrmDuplicateController::class, 'show']);
Route::post('/crm/duplicates/{id}/merge', [CrmDuplicateController::class, 'merge']);
Route::post('/crm/duplicates/{id}/ignore', [CrmDuplicateController::class, 'ignore']);
Route::post('/crm/duplicates/{id}/mark-not-duplicate', [CrmDuplicateController::class, 'markNotDuplicate']);
Route::delete('/crm/duplicates/{id}', [CrmDuplicateController::class, 'destroy']);

// ===== Import/Export =====
Route::post('/crm/imports/upload', [CrmImportExportController::class, 'uploadImport']);
Route::get('/crm/imports', [CrmImportExportController::class, 'indexImports']);
Route::get('/crm/imports/{id}', [CrmImportExportController::class, 'showImport']);
Route::get('/crm/imports/{id}/errors', [CrmImportExportController::class, 'importErrors']);

Route::post('/crm/exports', [CrmImportExportController::class, 'createExport']);
Route::get('/crm/exports', [CrmImportExportController::class, 'indexExports']);
Route::get('/crm/exports/{id}', [CrmImportExportController::class, 'showExport']);
Route::get('/crm/exports/{id}/download', [CrmImportExportController::class, 'downloadExport']);
Route::delete('/crm/exports/{id}', [CrmImportExportController::class, 'destroyExport']);

// ===== Lead Score =====
Route::get('/crm/lead-score/rules', [CrmLeadScoreController::class, 'indexRules']);
Route::post('/crm/lead-score/rules', [CrmLeadScoreController::class, 'storeRule']);
Route::put('/crm/lead-score/rules/{id}', [CrmLeadScoreController::class, 'updateRule']);
Route::delete('/crm/lead-score/rules/{id}', [CrmLeadScoreController::class, 'destroyRule']);
Route::post('/crm/lead-score/seed-defaults', [CrmLeadScoreController::class, 'seedDefaults']);
Route::post('/crm/lead-score/recalculate/{leadId}', [CrmLeadScoreController::class, 'recalculate']);