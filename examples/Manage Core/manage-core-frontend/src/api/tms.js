import client, { getApiBaseUrl } from './client';

export const getTmsStats = async () => {
  const response = await client.get('/tms/stats');
  return response.data.data;
};

export const listProjectTasks = async (projectId, options = {}) => {
  const response = await client.get(`/projects/${projectId}/tasks`, options);
  return response.data.data;
};

export const listAllTasks = async (projectId = null, options = {}) => {
  const params = projectId ? { project_id: projectId } : {};
  const response = await client.get('/tasks', { params, ...options });
  return response.data.data;
};

export const getTmsWorkHeatmap = async (params = {}, options = {}) => {
  const response = await client.get('/time-logs/work-heatmap', { params, ...options });
  return response.data.data;
};

export const listProjectMilestones = async (projectId) => {
  const response = await client.get(`/projects/${projectId}/milestones`);
  return response.data.data;
};

// Tags
export const listTags = async () => {
  const response = await client.get('/tags');
  return response.data.data;
};

export const createTag = async (data) => {
  const response = await client.post('/tags', data);
  return response.data.data;
};

export const deleteTag = async (id) => {
  const response = await client.delete(`/tags/${id}`);
  return response.data;
};

export const addTaskTag = async (taskId, tagId) => {
  const response = await client.post(`/tasks/${taskId}/tags`, { tag_id: tagId });
  return response.data.data;
};

export const removeTaskTag = async (taskId, tagId) => {
  const response = await client.delete(`/tasks/${taskId}/tags/${tagId}`);
  return response.data;
};

// Time Tracking
export const listTaskTimeLogs = async (taskId) => {
  const response = await client.get(`/tasks/${taskId}/time-logs`);
  return response.data.data;
};

export const startTimeLog = async (taskId, note = '') => {
  const response = await client.post(`/tasks/${taskId}/time-logs`, { note });
  return response.data.data;
};

export const stopTimeLog = async (logId) => {
  const response = await client.patch(`/time-logs/${logId}/stop`);
  return response.data.data;
};

// Activity Logs
export const listTaskActivityLogs = async (taskId) => {
  const response = await client.get(`/tasks/${taskId}/activity-logs`);
  return response.data.data;
};

// Attachments
export const listTaskAttachments = async (taskId, options = {}) => {
  const response = await client.get(`/tasks/${taskId}/attachments`, options);
  return response.data.data;
};

export const listAllAttachments = async (params = {}) => {
  const response = await client.get('/task-attachments', { params });
  return response.data.data;
};

export const bulkTaskAttachments = async (taskIds) => {
  const response = await client.get('/task-attachments', { params: { task_ids: taskIds.join(',') } });
  const grouped = {};
  (response.data.data || []).forEach(att => {
    if (!grouped[att.task_id]) grouped[att.task_id] = [];
    grouped[att.task_id].push(att);
  });
  return grouped;
};

export const uploadTaskAttachment = async (taskId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await client.post(`/tasks/${taskId}/attachments`, formData);
  return response.data.data;
};

export const getAttachmentContent = async (attachmentId) => {
  const response = await client.get(`/task-attachments/${attachmentId}/content`);
  return response.data.data;
};

export const updateAttachmentContent = async (attachmentId, data) => {
  const response = await client.patch(`/task-attachments/${attachmentId}`, data);
  return response.data.data;
};

export const deleteTaskAttachment = async (attachmentId) => {
  const response = await client.delete(`/task-attachments/${attachmentId}`);
  return response.data;
};

export const getTaskAttachmentDownloadUrl = (attachmentId) => {
  return `${getApiBaseUrl()}/api/v1/task-attachments/${attachmentId}/download`;
};

// Dependencies
export const listTaskDependencies = async (taskId) => {
  const response = await client.get(`/tasks/${taskId}/dependencies`);
  return response.data.data;
};

export const createTaskDependency = async (taskId, dependsOnTaskId, type = 'FS', options = {}) => {
  const response = await client.post(`/tasks/${taskId}/dependencies`, { depends_on_task_id: dependsOnTaskId, type }, options);
  return response.data.data;
};

export const deleteTaskDependency = async (taskId, dependencyId, options = {}) => {
  const response = await client.delete(`/tasks/${taskId}/dependencies/${dependencyId}`, options);
  return response.data;
};

export const updateTaskDependency = async (taskId, dependencyId, data, options = {}) => {
  const response = await client.patch(`/tasks/${taskId}/dependencies/${dependencyId}`, data, options);
  return response.data.data;
};

export const listAllDependencies = async (projectId = null, options = {}) => {
  const params = projectId ? { project_id: projectId } : {};
  const response = await client.get('/task-dependencies', { params, ...options });
  return response.data.data;
};

// Time Log Summaries
export const listAllTimeLogs = async (taskId = null) => {
  const params = taskId ? { task_id: taskId } : {};
  const response = await client.get('/time-logs', { params });
  return response.data.data;
};

export const getTimeLogsWeeklySummary = async () => {
  const response = await client.get('/time-logs/weekly-summary');
  return response.data.data;
};

export const getRecentTimeLogs = async () => {
  const response = await client.get('/time-logs/recent');
  return response.data.data;
};

// Productivity Records
export const listProductivityRecords = async () => {
  const response = await client.get('/productivity-records');
  return response.data.data;
};

export const createProductivityRecord = async (data) => {
  const response = await client.post('/productivity-records', data);
  return response.data.data;
};

export const updateProductivityRecord = async (id, data) => {
  const response = await client.patch(`/productivity-records/${id}`, data);
  return response.data.data;
};

export const deleteProductivityRecord = async (id) => {
  const response = await client.delete(`/productivity-records/${id}`);
  return response.data;
};

export const getTaskCompletionReports = async () => {
  const response = await client.get('/tms/task-completion-reports');
  return response.data.data;
};

export const getTeamPerformance = async () => {
  const response = await client.get('/tms/team-performance');
  return response.data.data;
};

// Trash / Restore
export const listTrashedTasks = async (options = {}) => {
  const response = await client.get('/tasks/trashed', options);
  return response.data.data;
};

export const restoreTask = async (id, options = {}) => {
  const response = await client.post(`/tasks/${id}/restore`, undefined, options);
  return response.data.data;
};

export const deleteTask = async (id, options = {}) => {
  const response = await client.delete(`/tasks/${id}`, options);
  return response.data;
};

export const forceDeleteTask = async (id, options = {}) => {
  const response = await client.delete(`/tasks/${id}/force-delete`, options);
  return response.data;
};

// ==================== COLLABORATION ====================

export const listWorkspaces = async (params = {}) => {
  const response = await client.get('/tms/collaboration/workspaces', { params });
  return response.data;
};

export const createWorkspace = async (data) => {
  const response = await client.post('/tms/collaboration/workspaces', data);
  return response.data.data;
};

export const listDeptTasks = async (params = {}) => {
  const response = await client.get('/tms/collaboration/dept-tasks', { params });
  return response.data;
};

export const listMentions = async (params = {}) => {
  const response = await client.get('/tms/collaboration/mentions', { params });
  return response.data;
};

export const listClientCollaboration = async (params = {}) => {
  const response = await client.get('/tms/collaboration/client-collaboration', { params });
  return response.data;
};

export const listSharedBoards = async (params = {}) => {
  const response = await client.get('/tms/collaboration/shared-boards', { params });
  return response.data;
};

export const createSharedBoard = async (data) => {
  const response = await client.post('/tms/collaboration/shared-boards', data);
  return response.data.data;
};

export const listApprovals = async (params = {}) => {
  const response = await client.get('/tms/collaboration/approvals', { params });
  return response.data;
};

export const createApproval = async (data) => {
  const response = await client.post('/tms/collaboration/approvals', data);
  return response.data.data;
};

export const processApproval = async (id, data) => {
  const response = await client.patch(`/tms/collaboration/approvals/${id}`, data);
  return response.data.data;
};

export const listMultiAssignment = async (params = {}) => {
  const response = await client.get('/tms/collaboration/multi-assignment', { params });
  return response.data;
};

export const createMultiAssignment = async (data) => {
  const response = await client.post('/tms/collaboration/multi-assignment', data);
  return response.data.data;
};

// ==================== REPORTING ====================

export const getKpiDashboards = async () => {
  const response = await client.get('/tms/reporting/kpi-dashboards');
  return response.data.data;
};

export const getForecastingAnalytics = async () => {
  const response = await client.get('/tms/reporting/forecasting');
  return response.data.data;
};

export const getBurndownCharts = async (params = {}) => {
  const response = await client.get('/tms/reporting/burndown', { params });
  return response.data.data;
};

export const getAttendanceProductivity = async (params = {}) => {
  const response = await client.get('/tms/reporting/attendance-productivity', { params });
  return response.data.data;
};

export const exportReport = async (data) => {
  const response = await client.post('/tms/reporting/export', data);
  return response.data;
};
