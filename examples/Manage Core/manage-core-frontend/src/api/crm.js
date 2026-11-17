import client from './client';

const unwrap = (res) => res?.data?.data ?? res?.data ?? [];
const unwrapOne = (res) => res?.data?.data ?? res?.data ?? null;
const unwrapMeta = (res) => ({
  data: res?.data?.data ?? [],
  meta: res?.data?.meta ?? { current_page: 1, last_page: 1, per_page: 25, total: 0 }
});

// ============ Dashboard ============
export const getCrmDashboard = () => client.get('/api/v1/crm/dashboard');
export const getCrmAnalyticsDashboard = () => client.get('/api/v1/crm/analytics/dashboard').then(unwrap);
export const searchCrm = (q) => client.get('/api/v1/crm/analytics/search', { params: { q } }).then(unwrap);

// ============ Customers ============
export const listCustomers = (params = {}) => client.get('/api/v1/crm/customers', { params }).then(unwrapMeta);
export const getCustomer = (id) => client.get(`/api/v1/crm/customers/${id}`).then(unwrap);
export const createCustomer = (data) => client.post('/api/v1/crm/customers', data).then(unwrap);
export const updateCustomer = (id, data) => client.put(`/api/v1/crm/customers/${id}`, data).then(unwrap);
export const deleteCustomer = (id) => client.delete(`/api/v1/crm/customers/${id}`);

// ============ Leads ============
export const listLeads = (params = {}) => client.get('/api/v1/crm/leads', { params }).then(unwrapMeta);
export const getLead = (id) => client.get(`/api/v1/crm/leads/${id}`).then(unwrap);
export const createLead = (data) => client.post('/api/v1/crm/leads', data).then(unwrap);
export const updateLead = (id, data) => client.put(`/api/v1/crm/leads/${id}`, data).then(unwrap);
export const deleteLead = (id) => client.delete(`/api/v1/crm/leads/${id}`);
export const convertLead = (id, options) => client.post(`/api/v1/crm/leads/${id}/convert`, options).then(unwrap);
export const importLeads = (leads) => client.post('/api/v1/crm/leads/import', { leads }).then(unwrap);

// ============ Contacts ============
export const listContacts = (params = {}) => client.get('/api/v1/crm/contacts', { params }).then(unwrapMeta);
export const getContact = (id) => client.get(`/api/v1/crm/contacts/${id}`).then(unwrap);
export const createContact = (data) => client.post('/api/v1/crm/contacts', data).then(unwrap);
export const updateContact = (id, data) => client.put(`/api/v1/crm/contacts/${id}`, data).then(unwrap);
export const deleteContact = (id) => client.delete(`/api/v1/crm/contacts/${id}`);

// ============ Pipelines ============
export const listPipelines = () => client.get('/api/v1/crm/pipelines').then(unwrap);
export const getPipeline = (id) => client.get(`/api/v1/crm/pipelines/${id}`).then(unwrap);
export const createPipeline = (data) => client.post('/api/v1/crm/pipelines', data).then(unwrap);
export const updatePipeline = (id, data) => client.put(`/api/v1/crm/pipelines/${id}`, data).then(unwrap);
export const deletePipeline = (id) => client.delete(`/api/v1/crm/pipelines/${id}`);

// ============ Deals ============
export const listDeals = (params = {}) => client.get('/api/v1/crm/deals', { params }).then(unwrapMeta);
export const getDeal = (id) => client.get(`/api/v1/crm/deals/${id}`).then(unwrap);
export const createDeal = (data) => client.post('/api/v1/crm/deals', data).then(unwrap);
export const updateDeal = (id, data) => client.put(`/api/v1/crm/deals/${id}`, data).then(unwrap);
export const deleteDeal = (id) => client.delete(`/api/v1/crm/deals/${id}`);
export const moveDealStage = (id, stage, probability) => client.post(`/api/v1/crm/deals/${id}/stage`, { stage, probability }).then(unwrap);
export const markDealWon = (id) => client.post(`/api/v1/crm/deals/${id}/won`).then(unwrap);
export const markDealLost = (id, lost_reason) => client.post(`/api/v1/crm/deals/${id}/lost`, { lost_reason }).then(unwrap);

// ============ Activities ============
export const listActivities = (params = {}) => client.get('/api/v1/crm/activities', { params }).then(unwrapMeta);
export const getActivity = (id) => client.get(`/api/v1/crm/activities/${id}`).then(unwrap);
export const createActivity = (data) => client.post('/api/v1/crm/activities', data).then(unwrap);
export const updateActivity = (id, data) => client.put(`/api/v1/crm/activities/${id}`, data).then(unwrap);
export const completeActivity = (id) => client.post(`/api/v1/crm/activities/${id}/complete`).then(unwrap);
export const deleteActivity = (id) => client.delete(`/api/v1/crm/activities/${id}`);

// ============ Campaigns ============
export const listCampaigns = (params = {}) => client.get('/api/v1/crm/campaigns', { params }).then(unwrapMeta);
export const getCampaign = (id) => client.get(`/api/v1/crm/campaigns/${id}`).then(unwrap);
export const createCampaign = (data) => client.post('/api/v1/crm/campaigns', data).then(unwrap);
export const updateCampaign = (id, data) => client.put(`/api/v1/crm/campaigns/${id}`, data).then(unwrap);
export const deleteCampaign = (id) => client.delete(`/api/v1/crm/campaigns/${id}`);

// ============ Notes ============
export const listNotes = (params = {}) => client.get('/api/v1/crm/notes', { params }).then(unwrapMeta);
export const createNote = (data) => client.post('/api/v1/crm/notes', data).then(unwrap);
export const updateNote = (id, data) => client.put(`/api/v1/crm/notes/${id}`, data).then(unwrap);
export const deleteNote = (id) => client.delete(`/api/v1/crm/notes/${id}`);

// ============ Tasks ============
export const listTasks = (params = {}) => client.get('/api/v1/crm/tasks', { params }).then(unwrapMeta);
export const createTask = (data) => client.post('/api/v1/crm/tasks', data).then(unwrap);
export const updateTask = (id, data) => client.put(`/api/v1/crm/tasks/${id}`, data).then(unwrap);
export const completeTask = (id) => client.post(`/api/v1/crm/tasks/${id}/complete`).then(unwrap);
export const deleteTask = (id) => client.delete(`/api/v1/crm/tasks/${id}`);

// ============ Email Accounts ============
export const listEmailAccounts = (params = {}) => client.get('/api/v1/crm/email/accounts', { params }).then(unwrapMeta);
export const getEmailAccount = (id) => client.get(`/api/v1/crm/email/accounts/${id}`).then(unwrap);
export const createEmailAccount = (data) => client.post('/api/v1/crm/email/accounts', data).then(unwrap);
export const updateEmailAccount = (id, data) => client.put(`/api/v1/crm/email/accounts/${id}`, data).then(unwrap);
export const deleteEmailAccount = (id) => client.delete(`/api/v1/crm/email/accounts/${id}`);
export const syncEmailAccount = (id) => client.post(`/api/v1/crm/email/accounts/${id}/sync`);
export const pauseEmailSync = (id) => client.post(`/api/v1/crm/email/accounts/${id}/pause`);
export const resumeEmailSync = (id) => client.post(`/api/v1/crm/email/accounts/${id}/resume`);
export const testEmailAccount = (id) => client.post(`/api/v1/crm/email/accounts/${id}/test`);
export const getEmailOAuthUrl = (provider) => client.get('/api/v1/crm/email/oauth-url', { params: { provider } });

// ============ Email Inbox ============
export const listEmails = (params = {}) => client.get('/api/v1/crm/emails', { params }).then(unwrapMeta);
export const getEmail = (id) => client.get(`/api/v1/crm/emails/${id}`).then(unwrap);
export const sendEmail = (data) => client.post('/api/v1/crm/emails', data).then(unwrap);
export const replyEmail = (id, data) => client.post(`/api/v1/crm/emails/${id}/reply`, data).then(unwrap);
export const updateEmail = (id, data) => client.put(`/api/v1/crm/emails/${id}`, data).then(unwrap);
export const deleteEmail = (id) => client.delete(`/api/v1/crm/emails/${id}`);
export const bulkEmailAction = (ids, action, folder) => client.post('/api/v1/crm/emails/bulk-action', { ids, action, folder });
export const folderStats = () => client.get('/api/v1/crm/emails/folder-stats').then(unwrap);
export const createFromRecord = (data) => client.post('/api/v1/crm/emails/create-from-record', data).then(unwrap);

// ============ Email Threads ============
export const listEmailThreads = (params = {}) => client.get('/api/v1/crm/email/threads', { params }).then(unwrapMeta);
export const getEmailThread = (id) => client.get(`/api/v1/crm/email/threads/${id}`).then(unwrap);

// ============ Email Templates ============
export const listEmailTemplates = (params = {}) => client.get('/api/v1/crm/email/templates', { params }).then(unwrapMeta);
export const createEmailTemplate = (data) => client.post('/api/v1/crm/email/templates', data).then(unwrap);
export const updateEmailTemplate = (id, data) => client.put(`/api/v1/crm/email/templates/${id}`, data).then(unwrap);
export const deleteEmailTemplate = (id) => client.delete(`/api/v1/crm/email/templates/${id}`);
export const duplicateEmailTemplate = (id) => client.post(`/api/v1/crm/email/templates/${id}/duplicate`).then(unwrap);
export const previewEmailTemplate = (id, variables) => client.post(`/api/v1/crm/email/templates/${id}/preview`, { variables }).then(unwrap);

// ============ Email Signatures ============
export const listEmailSignatures = (params = {}) => client.get('/api/v1/crm/email/signatures', { params }).then(unwrapMeta);
export const createEmailSignature = (data) => client.post('/api/v1/crm/email/signatures', data).then(unwrap);
export const updateEmailSignature = (id, data) => client.put(`/api/v1/crm/email/signatures/${id}`, data).then(unwrap);
export const deleteEmailSignature = (id) => client.delete(`/api/v1/crm/email/signatures/${id}`);

// ============ Follow-ups ============
export const listFollowUps = (params = {}) => client.get('/api/v1/crm/followups', { params }).then(unwrapMeta);
export const getFollowUp = (id) => client.get(`/api/v1/crm/followups/${id}`).then(unwrap);
export const createFollowUp = (data) => client.post('/api/v1/crm/followups', data).then(unwrap);
export const updateFollowUp = (id, data) => client.put(`/api/v1/crm/followups/${id}`, data).then(unwrap);
export const completeFollowUp = (id, result) => client.post(`/api/v1/crm/followups/${id}/complete`, { result }).then(unwrap);
export const snoozeFollowUp = (id, due_at) => client.post(`/api/v1/crm/followups/${id}/snooze`, { due_at }).then(unwrap);
export const rescheduleFollowUp = (id, due_at) => client.post(`/api/v1/crm/followups/${id}/reschedule`, { due_at }).then(unwrap);
export const cancelFollowUp = (id, reason) => client.post(`/api/v1/crm/followups/${id}/cancel`, { reason }).then(unwrap);
export const deleteFollowUp = (id) => client.delete(`/api/v1/crm/followups/${id}`);
export const followUpStats = (params = {}) => client.get('/api/v1/crm/followups/stats', { params }).then(unwrap);

// ============ Sequences ============
export const listSequences = (params = {}) => client.get('/api/v1/crm/sequences', { params }).then(unwrapMeta);
export const getSequence = (id) => client.get(`/api/v1/crm/sequences/${id}`).then(unwrap);
export const createSequence = (data) => client.post('/api/v1/crm/sequences', data).then(unwrap);
export const updateSequence = (id, data) => client.put(`/api/v1/crm/sequences/${id}`, data).then(unwrap);
export const deleteSequence = (id) => client.delete(`/api/v1/crm/sequences/${id}`);
export const addSequenceStep = (id, data) => client.post(`/api/v1/crm/sequences/${id}/steps`, data).then(unwrap);
export const removeSequenceStep = (sequenceId, stepId) => client.delete(`/api/v1/crm/sequences/${sequenceId}/steps/${stepId}`);
export const enrollSequence = (id, entity_type, entity_id) => client.post(`/api/v1/crm/sequences/${id}/enroll`, { entity_type, entity_id }).then(unwrap);
export const bulkEnrollSequence = (id, entity_type, entity_ids) => client.post(`/api/v1/crm/sequences/${id}/bulk-enroll`, { entity_type, entity_ids });
export const listSequenceEnrollments = (id, params = {}) => client.get(`/api/v1/crm/sequences/${id}/enrollments`, { params }).then(unwrapMeta);
export const stopSequenceEnrollment = (enrollmentId) => client.post(`/api/v1/crm/sequences/enrollments/${enrollmentId}/stop`).then(unwrap);
export const pauseSequence = (id) => client.post(`/api/v1/crm/sequences/${id}/pause`).then(unwrap);
export const resumeSequence = (id) => client.post(`/api/v1/crm/sequences/${id}/resume`).then(unwrap);
export const sequenceStats = (id) => client.get(`/api/v1/crm/sequences/${id}/stats`).then(unwrap);

// ============ Automations ============
export const listAutomations = (params = {}) => client.get('/api/v1/crm/automations', { params }).then(unwrapMeta);
export const getAutomation = (id) => client.get(`/api/v1/crm/automations/${id}`).then(unwrap);
export const createAutomation = (data) => client.post('/api/v1/crm/automations', data).then(unwrap);
export const updateAutomation = (id, data) => client.put(`/api/v1/crm/automations/${id}`, data).then(unwrap);
export const deleteAutomation = (id) => client.delete(`/api/v1/crm/automations/${id}`);
export const toggleAutomation = (id) => client.post(`/api/v1/crm/automations/${id}/toggle`).then(unwrap);
export const runAutomation = (id, entity_type, entity_id) => client.post(`/api/v1/crm/automations/${id}/run`, { entity_type, entity_id }).then(unwrap);
export const listAutomationRuns = (id, params = {}) => client.get(`/api/v1/crm/automations/${id}/runs`, { params }).then(unwrapMeta);

// ============ Tags ============
export const listTags = (params = {}) => client.get('/api/v1/crm/tags', { params }).then(unwrapMeta);
export const getAllTags = () => client.get('/api/v1/crm/tags/all').then(unwrap);
export const createTag = (data) => client.post('/api/v1/crm/tags', data).then(unwrap);
export const updateTag = (id, data) => client.put(`/api/v1/crm/tags/${id}`, data).then(unwrap);
export const deleteTag = (id) => client.delete(`/api/v1/crm/tags/${id}`);
export const attachTag = (data) => client.post('/api/v1/crm/tags/attach', data);
export const detachTag = (data) => client.post('/api/v1/crm/tags/detach', data);

// ============ Custom Fields ============
export const listCustomFields = (params = {}) => client.get('/api/v1/crm/custom-fields', { params }).then(unwrap);
export const createCustomField = (data) => client.post('/api/v1/crm/custom-fields', data).then(unwrap);
export const updateCustomField = (id, data) => client.put(`/api/v1/crm/custom-fields/${id}`, data).then(unwrap);
export const deleteCustomField = (id) => client.delete(`/api/v1/crm/custom-fields/${id}`);
export const saveCustomFieldValues = (data) => client.post('/api/v1/crm/custom-fields/values', data);
export const getCustomFieldValues = (params) => client.get('/api/v1/crm/custom-fields/values', { params }).then(unwrap);

// ============ Audit ============
export const listAudit = (params = {}) => client.get('/api/v1/crm/audit', { params }).then(unwrapMeta);
export const getAuditEntry = (id) => client.get(`/api/v1/crm/audit/${id}`).then(unwrap);
export const getEntityTimeline = (entityType, entityId) => client.get(`/api/v1/crm/audit/timeline/${entityType}/${entityId}`).then(unwrap);

// ============ Documents ============
export const listDocuments = (params = {}) => client.get('/api/v1/crm/documents', { params }).then(unwrapMeta);
export const uploadDocument = (formData) => client.post('/api/v1/crm/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(unwrap);
export const getDocument = (id) => client.get(`/api/v1/crm/documents/${id}`).then(unwrap);
export const updateDocument = (id, data) => client.put(`/api/v1/crm/documents/${id}`, data).then(unwrap);
export const deleteDocument = (id) => client.delete(`/api/v1/crm/documents/${id}`);
export const downloadDocument = (id) => client.get(`/api/v1/crm/documents/${id}/download`, { responseType: 'blob' });

// ============ Notifications ============
export const listNotifications = (params = {}) => client.get('/api/v1/crm/notifications', { params }).then(unwrapMeta);
export const getUnreadCount = () => client.get('/api/v1/crm/notifications/unread-count').then(unwrap);
export const markAllRead = () => client.post('/api/v1/crm/notifications/mark-all-read');
export const markNotificationRead = (id) => client.post(`/api/v1/crm/notifications/${id}/read`).then(unwrap);
export const deleteNotification = (id) => client.delete(`/api/v1/crm/notifications/${id}`);

// ============ Calendar ============
export const listCalendarEvents = (params = {}) => client.get('/api/v1/crm/calendar/events', { params }).then(unwrap);
export const calendarMonthView = (params = {}) => client.get('/api/v1/crm/calendar/month', { params }).then(unwrap);
export const createCalendarEvent = (data) => client.post('/api/v1/crm/calendar/events', data).then(unwrap);
export const updateCalendarEvent = (id, data) => client.put(`/api/v1/crm/calendar/events/${id}`, data).then(unwrap);
export const deleteCalendarEvent = (id) => client.delete(`/api/v1/crm/calendar/events/${id}`);

// ============ Duplicates ============
export const listDuplicates = (params = {}) => client.get('/api/v1/crm/duplicates', { params }).then(unwrapMeta);
export const getDuplicateGroup = (id) => client.get(`/api/v1/crm/duplicates/${id}`).then(unwrap);
export const scanDuplicates = (entity_type) => client.post('/api/v1/crm/duplicates/scan', { entity_type });
export const mergeDuplicates = (id, data) => client.post(`/api/v1/crm/duplicates/${id}/merge`, data).then(unwrap);
export const ignoreDuplicate = (id) => client.post(`/api/v1/crm/duplicates/${id}/ignore`);
export const markNotDuplicate = (id) => client.post(`/api/v1/crm/duplicates/${id}/mark-not-duplicate`);
export const deleteDuplicate = (id) => client.delete(`/api/v1/crm/duplicates/${id}`);

// ============ Import / Export ============
export const uploadImport = (formData) => client.post('/api/v1/crm/imports/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(unwrap);
export const listImports = (params = {}) => client.get('/api/v1/crm/imports', { params }).then(unwrapMeta);
export const getImport = (id) => client.get(`/api/v1/crm/imports/${id}`).then(unwrap);
export const getImportErrors = (id) => client.get(`/api/v1/crm/imports/${id}/errors`).then(unwrap);
export const createExport = (data) => client.post('/api/v1/crm/exports', data).then(unwrap);
export const listExports = (params = {}) => client.get('/api/v1/crm/exports', { params }).then(unwrapMeta);
export const getExport = (id) => client.get(`/api/v1/crm/exports/${id}`).then(unwrap);
export const downloadExport = (id) => client.get(`/api/v1/crm/exports/${id}/download`, { responseType: 'blob' });
export const deleteExport = (id) => client.delete(`/api/v1/crm/exports/${id}`);

// ============ Lead Score ============
export const listScoreRules = (params = {}) => client.get('/api/v1/crm/lead-score/rules', { params }).then(unwrap);
export const createScoreRule = (data) => client.post('/api/v1/crm/lead-score/rules', data).then(unwrap);
export const updateScoreRule = (id, data) => client.put(`/api/v1/crm/lead-score/rules/${id}`, data).then(unwrap);
export const deleteScoreRule = (id) => client.delete(`/api/v1/crm/lead-score/rules/${id}`);
export const seedDefaultScoreRules = () => client.post('/api/v1/crm/lead-score/seed-defaults');
export const recalculateLeadScore = (leadId) => client.post(`/api/v1/crm/lead-score/recalculate/${leadId}`).then(unwrap);

// ============ Reports ============
export const getPipelineReport = () => client.get('/api/v1/crm/reports/pipeline').then(unwrap);
export const getConversionReport = () => client.get('/api/v1/crm/reports/conversion').then(unwrap);
export const getActivityReport = () => client.get('/api/v1/crm/reports/activities').then(unwrap);
export const getTopPerformers = () => client.get('/api/v1/crm/reports/performers').then(unwrap);
export const getPerformersReport = () => client.get('/api/v1/crm/reports/performers').then(unwrap);
export const getRevenueBySource = () => client.get('/api/v1/crm/reports/revenue-by-source').then(unwrap);
export const getLeadReport = (params = {}) => client.get('/api/v1/crm/reports/leads', { params }).then(unwrap);
export const getDealReport = (params = {}) => client.get('/api/v1/crm/reports/deals', { params }).then(unwrap);
export const getEmailReport = (params = {}) => client.get('/api/v1/crm/reports/emails', { params }).then(unwrap);
export const getCampaignReport = (params = {}) => client.get('/api/v1/crm/reports/campaigns', { params }).then(unwrapMeta);
export const getFollowUpReport = () => client.get('/api/v1/crm/reports/follow-ups').then(unwrap);