import client from './client';

export const getDmsStats = async () => {
  const response = await client.get('/dms/stats');
  return response.data.data;
};

export const getDmsAnalytics = async () => {
  const response = await client.get('/dms/analytics');
  return response.data.data;
};

export const searchDms = async (params) => {
  const response = await client.get('/dms/search', { params });
  return response.data.data;
};

// Folders
export const listFolders = async () => {
  const response = await client.get('/dms/folders', { skipCache: true });
  return response.data.data;
};

export const createFolder = async (data) => {
  const response = await client.post('/dms/folders', data);
  return response.data.data;
};

export const updateFolder = async (id, data) => {
  const response = await client.put(`/dms/folders/${id}`, data);
  return response.data.data;
};

export const deleteFolder = async (id) => {
  const response = await client.delete(`/dms/folders/${id}`);
  return response.data;
};

// Documents
export const listDocuments = async (params) => {
  const response = await client.get('/dms/documents', { params, skipCache: true });
  return response.data;
};

export const getDocument = async (id) => {
  const response = await client.get(`/dms/documents/${id}`);
  return response.data.data;
};

export const createDocument = async (data) => {
  const response = await client.post('/dms/documents', data);
  return response.data.data;
};

export const updateDocument = async (id, data) => {
  const response = await client.put(`/dms/documents/${id}`, data);
  return response.data.data;
};

export const deleteDocument = async (id) => {
  const response = await client.delete(`/dms/documents/${id}`);
  return response.data;
};

export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await client.post('/dms/upload', formData);
  return response.data.data;
};

// Versions
export const listDocumentVersions = async (documentId) => {
  const response = await client.get(`/dms/documents/${documentId}/versions`);
  return response.data.data;
};

export const createDocumentVersion = async (documentId, data) => {
  const response = await client.post(`/dms/documents/${documentId}/versions`, data);
  return response.data.data;
};

export const restoreDocumentVersion = async (documentId, versionId) => {
  const response = await client.post(`/dms/documents/${documentId}/versions/${versionId}/restore`);
  return response.data.data;
};

// Signatures
export const listDocumentSignatures = async (documentId) => {
  const response = await client.get(`/dms/documents/${documentId}/signatures`);
  return response.data.data;
};

export const createSignature = async (documentId, data) => {
  const response = await client.post(`/dms/documents/${documentId}/signatures`, data);
  return response.data.data;
};

export const updateSignatureStatus = async (id, data) => {
  const response = await client.patch(`/dms/signatures/${id}`, data);
  return response.data.data;
};

// Approvals
export const listDocumentApprovals = async (documentId) => {
  const response = await client.get(`/dms/documents/${documentId}/approvals`);
  return response.data.data;
};

export const createApproval = async (documentId, data) => {
  const response = await client.post(`/dms/documents/${documentId}/approvals`, data);
  return response.data.data;
};

export const updateApprovalStatus = async (id, data) => {
  const response = await client.patch(`/dms/approvals/${id}`, data);
  return response.data.data;
};

// Comments
export const listDocumentComments = async (documentId) => {
  const response = await client.get(`/dms/documents/${documentId}/comments`);
  return response.data.data;
};

export const addComment = async (documentId, data) => {
  const response = await client.post(`/dms/documents/${documentId}/comments`, data);
  return response.data.data;
};

export const deleteComment = async (id) => {
  const response = await client.delete(`/dms/comments/${id}`);
  return response.data;
};

// Shares
export const listDocumentShares = async (documentId) => {
  const response = await client.get(`/dms/documents/${documentId}/shares`);
  return response.data.data;
};

export const shareDocument = async (documentId, data) => {
  const response = await client.post(`/dms/documents/${documentId}/shares`, data);
  return response.data.data;
};

export const revokeShare = async (id) => {
  const response = await client.delete(`/dms/shares/${id}`);
  return response.data;
};

// Audit Logs
export const listDocumentAuditLogs = async (documentId) => {
  const response = await client.get(`/dms/documents/${documentId}/audit-logs`);
  return response.data.data;
};

export const listAuditLogs = async (params) => {
  const response = await client.get('/dms/audit-logs', { params });
  return response.data.data;
};

// Templates
export const listTemplates = async () => {
  const response = await client.get('/dms/templates');
  return response.data.data;
};

export const createTemplate = async (data) => {
  const response = await client.post('/dms/templates', data);
  return response.data.data;
};

export const updateTemplate = async (id, data) => {
  const response = await client.put(`/dms/templates/${id}`, data);
  return response.data.data;
};

export const deleteTemplate = async (id) => {
  const response = await client.delete(`/dms/templates/${id}`);
  return response.data;
};

// AI Intelligence
export const getAiClassification = async (documentId) => {
  const response = await client.get(`/dms/documents/${documentId}/ai-classification`);
  return response.data.data;
};

export const analyzeDocument = async (documentId) => {
  const response = await client.post(`/dms/documents/${documentId}/ai-analyze`);
  return response.data.data;
};

export const getDocumentSummary = async (documentId) => {
  const response = await client.get(`/dms/documents/${documentId}/summary`);
  return response.data.data;
};

export const detectDuplicates = async () => {
  const response = await client.get('/dms/ai/duplicates');
  return response.data.data;
};

export const getAiRecommendations = async () => {
  const response = await client.get('/dms/ai/recommendations');
  return response.data.data;
};

export const aiSearch = async (query) => {
  const response = await client.post('/dms/ai/search', { query });
  return response.data.data;
};

export const checkPolicyCompliance = async (documentId) => {
  const response = await client.get(`/dms/documents/${documentId}/compliance-check`);
  return response.data.data;
};

// Archive
export const listArchivedDocuments = async (params) => {
  const response = await client.get('/dms/archived', { params });
  return response.data.data;
};

export const restoreArchivedDocument = async (id) => {
  const response = await client.post(`/dms/archived/${id}/restore`);
  return response.data.data;
};

export const permanentDeleteDocument = async (id) => {
  const response = await client.delete(`/dms/archived/${id}/permanent-delete`);
  return response.data;
};

export const getRetentionPolicies = async () => {
  const response = await client.get('/dms/retention-policies');
  return response.data.data;
};

export const getArchiveStats = async () => {
  const response = await client.get('/dms/archive-stats');
  return response.data.data;
};

// Collaboration
export const listCollaborationDiscussions = async (documentId) => {
  const response = await client.get(`/dms/documents/${documentId}/discussions`);
  return response.data.data;
};

export const createDiscussion = async (documentId, data) => {
  const response = await client.post(`/dms/documents/${documentId}/discussions`, data);
  return response.data.data;
};

export const addDiscussionReply = async (discussionId, data) => {
  const response = await client.post(`/dms/discussions/${discussionId}/replies`, data);
  return response.data.data;
};

export const listCollaborationTasks = async (documentId) => {
  const response = await client.get(`/dms/documents/${documentId}/collab-tasks`);
  return response.data.data;
};

export const createCollaborationTask = async (documentId, data) => {
  const response = await client.post(`/dms/documents/${documentId}/collab-tasks`, data);
  return response.data.data;
};

export const updateCollaborationTask = async (taskId, data) => {
  const response = await client.put(`/dms/collab-tasks/${taskId}`, data);
  return response.data.data;
};

// Document Viewer
export const getDocumentPreviewUrl = async (documentId) => {
  const response = await client.get(`/dms/documents/${documentId}/preview-url`);
  return response.data.data;
};

export const addDocumentAnnotation = async (documentId, data) => {
  const response = await client.post(`/dms/documents/${documentId}/annotations`, data);
  return response.data.data;
};

export const listDocumentAnnotations = async (documentId) => {
  const response = await client.get(`/dms/documents/${documentId}/annotations`);
  return response.data.data;
};

export const compareDocumentVersions = async (documentId, versionId1, versionId2) => {
  const response = await client.get(`/dms/documents/${documentId}/compare`, { params: { v1: versionId1, v2: versionId2 } });
  return response.data.data;
};
