<?php

use App\Http\Controllers\Api\MilestoneController;
use App\Http\Controllers\Api\ProductivityRecordController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\PmsController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\TaskAttachmentController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TmsCollaborationController;
use App\Http\Controllers\Api\TmsReportingController;
use Illuminate\Support\Facades\Route;

Route::get('/projects/summary', [ProjectController::class, 'summary']);
Route::get('/projects/download/{project}', [ProjectController::class, 'download']);
Route::apiResource('projects', ProjectController::class);

Route::get('/projects/{project}/tasks', [TaskController::class, 'index']);
Route::post('/projects/{project}/tasks', [TaskController::class, 'store']);
Route::get('/tasks', [TaskController::class, 'listAll']);
Route::post('/tasks', [TaskController::class, 'store']);
Route::get('/tasks/trashed', [TaskController::class, 'trashed']);
Route::post('/tasks/{id}/restore', [TaskController::class, 'restore']);
Route::delete('/tasks/{id}/force-delete', [TaskController::class, 'forceDestroy']);
Route::apiResource('tasks', TaskController::class)->only(['show', 'update', 'destroy']);

Route::get('/projects/{project}/milestones', [MilestoneController::class, 'index']);
Route::post('/projects/{project}/milestones', [MilestoneController::class, 'store']);
Route::apiResource('milestones', MilestoneController::class)->only(['show', 'update', 'destroy']);

Route::get('/tms/stats', [\App\Http\Controllers\Api\TmsController::class, 'stats']);
Route::get('/tms/task-completion-reports', [\App\Http\Controllers\Api\TmsController::class, 'taskCompletionReports']);
Route::get('/tms/team-performance', [\App\Http\Controllers\Api\TmsController::class, 'teamPerformance']);
Route::apiResource('tags', TagController::class);

Route::post('/tasks/{task}/tags', [TaskController::class, 'addTag']);
Route::delete('/tasks/{task}/tags/{tag}', [TaskController::class, 'removeTag']);
Route::get('/tasks/{task}/time-logs', [TaskController::class, 'timeLogs']);
Route::post('/tasks/{task}/time-logs', [TaskController::class, 'startTimeLog']);
Route::patch('/time-logs/{timeLog}/stop', [TaskController::class, 'stopTimeLog']);
Route::get('/tasks/{task}/activity-logs', [TaskController::class, 'activityLogs']);
Route::get('/tasks/{task}/dependencies', [TaskController::class, 'dependencies']);
Route::post('/tasks/{task}/dependencies', [TaskController::class, 'storeDependency']);
Route::delete('/tasks/{task}/dependencies/{dependency}', [TaskController::class, 'destroyDependency']);
Route::patch('/tasks/{task}/dependencies/{dependency}', [TaskController::class, 'updateDependency']);
Route::get('/task-dependencies', [TaskController::class, 'listAllDependencies']);
Route::get('/time-logs', [TaskController::class, 'listAllTimeLogs']);
Route::get('/time-logs/weekly-summary', [TaskController::class, 'weeklyTimeSummary']);
Route::get('/time-logs/recent', [TaskController::class, 'recentTimeLogs']);
Route::get('/time-logs/work-heatmap', [TaskController::class, 'workHeatmap']);

Route::get('/tasks/{task}/attachments', [TaskAttachmentController::class, 'index']);
Route::post('/tasks/{task}/attachments', [TaskAttachmentController::class, 'store']);
Route::get('/task-attachments', [TaskAttachmentController::class, 'listAll']);
Route::get('/task-attachments/{attachment}/download', [TaskAttachmentController::class, 'download']);
Route::get('/task-attachments/{attachment}/content', [TaskAttachmentController::class, 'content']);
Route::patch('/task-attachments/{attachment}', [TaskAttachmentController::class, 'updateContent']);
Route::delete('/task-attachments/{attachment}', [TaskAttachmentController::class, 'destroy']);
Route::apiResource('productivity-records', ProductivityRecordController::class);

Route::get('/tms/collaboration/workspaces', [TmsCollaborationController::class, 'teamWorkspaces']);
Route::post('/tms/collaboration/workspaces', [TmsCollaborationController::class, 'storeWorkspace']);
Route::get('/tms/collaboration/dept-tasks', [TmsCollaborationController::class, 'deptTaskManagement']);
Route::get('/tms/collaboration/mentions', [TmsCollaborationController::class, 'teamMentions']);
Route::get('/tms/collaboration/client-tasks', [TmsCollaborationController::class, 'clientCollaboration']);
Route::get('/tms/collaboration/shared-boards', [TmsCollaborationController::class, 'sharedTaskBoards']);
Route::post('/tms/collaboration/shared-boards', [TmsCollaborationController::class, 'storeSharedBoard']);
Route::get('/tms/collaboration/approvals', [TmsCollaborationController::class, 'approvalWorkflows']);
Route::post('/tms/collaboration/approvals', [TmsCollaborationController::class, 'storeApproval']);
Route::patch('/tms/collaboration/approvals/{id}/process', [TmsCollaborationController::class, 'processApproval']);
Route::get('/tms/collaboration/multi-assign', [TmsCollaborationController::class, 'multiUserAssignment']);
Route::post('/tms/collaboration/multi-assign', [TmsCollaborationController::class, 'assignMultiple']);

Route::get('/tms/reporting/kpi-dashboards', [TmsReportingController::class, 'kpiDashboards']);
Route::get('/tms/reporting/forecasting', [TmsReportingController::class, 'forecastingAnalytics']);
Route::get('/tms/reporting/burndown', [TmsReportingController::class, 'burndownCharts']);
Route::get('/tms/reporting/attendance-productivity', [TmsReportingController::class, 'attendanceProductivityInsights']);
Route::get('/tms/reporting/export', [TmsReportingController::class, 'exportReports']);

// ─── PMS Sub-Feature APIs ──────────────────────────────────
Route::get('/pms/dashboard', [PmsController::class, 'dashboard']);

// Budget Tracking
Route::get('/pms/budgets', [PmsController::class, 'listBudgets']);
Route::post('/pms/budgets', [PmsController::class, 'storeBudget']);
Route::put('/pms/budgets/{budget}', [PmsController::class, 'updateBudget']);
Route::delete('/pms/budgets/{budget}', [PmsController::class, 'destroyBudget']);

// Cost Tracking
Route::get('/pms/costs', [PmsController::class, 'listCosts']);
Route::post('/pms/costs', [PmsController::class, 'storeCost']);
Route::put('/pms/costs/{cost}', [PmsController::class, 'updateCost']);
Route::delete('/pms/costs/{cost}', [PmsController::class, 'destroyCost']);

// Progress Tracking
Route::get('/pms/progress', [PmsController::class, 'listProgress']);
Route::post('/pms/progress', [PmsController::class, 'storeProgress']);
Route::put('/pms/progress/{progress}', [PmsController::class, 'updateProgress']);

// Resource Allocation
Route::get('/pms/resources', [PmsController::class, 'listResources']);
Route::post('/pms/resources', [PmsController::class, 'storeAllocation']);
Route::put('/pms/resources/{resource}', [PmsController::class, 'updateAllocation']);
Route::delete('/pms/resources/{resource}', [PmsController::class, 'destroyAllocation']);

// Sprint Management
Route::get('/pms/sprints', [PmsController::class, 'listSprints']);
Route::post('/pms/sprints', [PmsController::class, 'storeSprint']);
Route::put('/pms/sprints/{sprint}', [PmsController::class, 'updateSprint']);
Route::delete('/pms/sprints/{sprint}', [PmsController::class, 'destroySprint']);

// Backlog Management
Route::get('/pms/backlog', [PmsController::class, 'listBacklog']);
Route::post('/pms/backlog', [PmsController::class, 'storeBacklogItem']);
Route::put('/pms/backlog/{item}', [PmsController::class, 'updateBacklogItem']);
Route::delete('/pms/backlog/{item}', [PmsController::class, 'destroyBacklogItem']);

// Risk Tracking
Route::get('/pms/risks', [PmsController::class, 'listRisks']);
Route::post('/pms/risks', [PmsController::class, 'storeRisk']);
Route::put('/pms/risks/{risk}', [PmsController::class, 'updateRisk']);
Route::delete('/pms/risks/{risk}', [PmsController::class, 'destroyRisk']);

// Documentation
Route::get('/pms/docs', [PmsController::class, 'listDocs']);
Route::post('/pms/docs', [PmsController::class, 'storeDoc']);
Route::put('/pms/docs/{doc}', [PmsController::class, 'updateDoc']);
Route::delete('/pms/docs/{doc}', [PmsController::class, 'destroyDoc']);

// Calendar Events
Route::get('/pms/calendar', [PmsController::class, 'listCalendarEvents']);
Route::post('/pms/calendar', [PmsController::class, 'storeCalendarEvent']);
Route::put('/pms/calendar/{event}', [PmsController::class, 'updateCalendarEvent']);
Route::delete('/pms/calendar/{event}', [PmsController::class, 'destroyCalendarEvent']);
