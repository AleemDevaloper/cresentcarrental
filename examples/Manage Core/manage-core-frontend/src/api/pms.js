import client from './client';

// ─── Projects ────────────────────────────────────────────────
// (import listProjects from './projects')

// ─── Tasks ───────────────────────────────────────────────────
export const listTasks = async (projectId) => {
  const response = await client.get(`/projects/${projectId}/tasks`);
  return response.data.data;
};

export const createTask = async (projectId, data) => {
  const url = projectId ? `/projects/${projectId}/tasks` : '/tasks';
  const response = await client.post(url, data);
  return response.data.data;
};

export const updateTask = async (id, data, options = {}) => {
  const response = await client.patch(`/tasks/${id}`, data, options);
  return response.data.data;
};

export const deleteTask = async (id) => {
  const response = await client.delete(`/tasks/${id}`);
  return response.data;
};

// ─── Milestones ──────────────────────────────────────────────
export const listMilestones = async (projectId) => {
  const response = await client.get(`/projects/${projectId}/milestones`);
  return response.data.data;
};

export const createMilestone = async (projectId, data) => {
  const response = await client.post(`/projects/${projectId}/milestones`, data);
  return response.data.data;
};

export const updateMilestone = async (id, data) => {
  const response = await client.patch(`/milestones/${id}`, data);
  return response.data.data;
};

export const deleteMilestone = async (id) => {
  const response = await client.delete(`/milestones/${id}`);
  return response.data;
};

// ─── Budgets ─────────────────────────────────────────────────
export const listBudgets = async (params = {}) => {
  const response = await client.get('/pms/budgets', { params: { per_page: 200, ...params }, skipCache: true });
  return response.data.data;
};

export const createBudget = async (data) => {
  const response = await client.post('/pms/budgets', data);
  return response.data.data;
};

export const updateBudget = async (id, data) => {
  const response = await client.put(`/pms/budgets/${id}`, data);
  return response.data.data;
};

export const deleteBudget = async (id) => {
  await client.delete(`/pms/budgets/${id}`);
};

// ─── Costs ───────────────────────────────────────────────────
export const listCosts = async (params = {}) => {
  const response = await client.get('/pms/costs', { params: { per_page: 200, ...params }, skipCache: true });
  return response.data.data;
};

export const createCost = async (data) => {
  const response = await client.post('/pms/costs', data);
  return response.data.data;
};

export const updateCost = async (id, data) => {
  const response = await client.put(`/pms/costs/${id}`, data);
  return response.data.data;
};

export const deleteCost = async (id) => {
  await client.delete(`/pms/costs/${id}`);
};

// ─── Progress ────────────────────────────────────────────────
export const listProgress = async (params = {}) => {
  const response = await client.get('/pms/progress', { params: { per_page: 200, ...params }, skipCache: true });
  return response.data.data;
};

export const createProgress = async (data) => {
  const response = await client.post('/pms/progress', data);
  return response.data.data;
};

export const updateProgress = async (id, data) => {
  const response = await client.put(`/pms/progress/${id}`, data);
  return response.data.data;
};

// ─── Resources ───────────────────────────────────────────────
export const listResources = async (params = {}) => {
  const response = await client.get('/pms/resources', { params: { per_page: 200, ...params }, skipCache: true });
  return response.data.data;
};

export const createResource = async (data) => {
  const response = await client.post('/pms/resources', data);
  return response.data.data;
};

export const updateResource = async (id, data) => {
  const response = await client.put(`/pms/resources/${id}`, data);
  return response.data.data;
};

export const deleteResource = async (id) => {
  await client.delete(`/pms/resources/${id}`);
};

// ─── Sprints ─────────────────────────────────────────────────
export const listSprints = async (params = {}) => {
  const response = await client.get('/pms/sprints', { params: { per_page: 200, ...params }, skipCache: true });
  return response.data.data;
};

export const createSprint = async (data) => {
  const response = await client.post('/pms/sprints', data);
  return response.data.data;
};

export const updateSprint = async (id, data) => {
  const response = await client.put(`/pms/sprints/${id}`, data);
  return response.data.data;
};

export const deleteSprint = async (id) => {
  await client.delete(`/pms/sprints/${id}`);
};

// ─── Backlog ─────────────────────────────────────────────────
export const listBacklog = async (params = {}) => {
  const response = await client.get('/pms/backlog', { params: { per_page: 200, ...params }, skipCache: true });
  return response.data.data;
};

export const createBacklogItem = async (data) => {
  const response = await client.post('/pms/backlog', data);
  return response.data.data;
};

export const updateBacklogItem = async (id, data) => {
  const response = await client.put(`/pms/backlog/${id}`, data);
  return response.data.data;
};

export const deleteBacklogItem = async (id) => {
  await client.delete(`/pms/backlog/${id}`);
};

// ─── Risks ───────────────────────────────────────────────────
export const listRisks = async (params = {}) => {
  const response = await client.get('/pms/risks', { params: { per_page: 200, ...params }, skipCache: true });
  return response.data.data;
};

export const createRisk = async (data) => {
  const response = await client.post('/pms/risks', data);
  return response.data.data;
};

export const updateRisk = async (id, data) => {
  const response = await client.put(`/pms/risks/${id}`, data);
  return response.data.data;
};

export const deleteRisk = async (id) => {
  await client.delete(`/pms/risks/${id}`);
};

// ─── Documentation ───────────────────────────────────────────
export const listDocs = async (params = {}) => {
  const response = await client.get('/pms/docs', { params: { per_page: 200, ...params }, skipCache: true });
  return response.data.data;
};

export const createDoc = async (data) => {
  const response = await client.post('/pms/docs', data);
  return response.data.data;
};

export const updateDoc = async (id, data) => {
  const response = await client.put(`/pms/docs/${id}`, data);
  return response.data.data;
};

export const deleteDoc = async (id) => {
  await client.delete(`/pms/docs/${id}`);
};

// ─── Calendar Events ─────────────────────────────────────────
export const listCalendarEvents = async (params = {}) => {
  const response = await client.get('/pms/calendar', { params: { per_page: 200, ...params }, skipCache: true });
  return response.data.data;
};

export const createCalendarEvent = async (data) => {
  const response = await client.post('/pms/calendar', data);
  return response.data.data;
};

export const updateCalendarEvent = async (id, data) => {
  const response = await client.put(`/pms/calendar/${id}`, data);
  return response.data.data;
};

export const deleteCalendarEvent = async (id) => {
  await client.delete(`/pms/calendar/${id}`);
};
