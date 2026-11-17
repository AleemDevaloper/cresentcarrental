import { apiRequest } from './client';

export async function getSupportStats() {
  const res = await apiRequest('/api/v1/support/stats');
  return res.data || res;
}

export async function getSupportConversations() {
  const res = await apiRequest('/api/v1/support/conversations');
  return res.data || [];
}

export async function createSupportConversation(data) {
  const res = await apiRequest('/api/v1/support/conversations', {
    method: 'POST',
    body: data,
  });
  return res.data || res;
}

export async function getSupportConversation(id) {
  const res = await apiRequest(`/api/v1/support/conversations/${id}`);
  return res.data || res;
}

export async function addSupportMessage(conversationId, text) {
  const res = await apiRequest(`/api/v1/support/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: { text },
  });
  return res.data || res;
}

export async function addParticipant(conversationId, userId) {
  const res = await apiRequest(`/api/v1/support/conversations/${conversationId}/participants`, {
    method: 'POST',
    body: { userId },
  });
  return res.data || res;
}

export async function updateConversationStatus(conversationId, status) {
  const res = await apiRequest(`/api/v1/support/conversations/${conversationId}/status`, {
    method: 'PATCH',
    body: { status },
  });
  return res.data || res;
}

export async function getAvailableSupportUsers() {
  const res = await apiRequest('/api/v1/support/users');
  return res.data || [];
}
