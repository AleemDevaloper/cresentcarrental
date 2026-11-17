import { apiRequest } from "./client";

// === Chat Requests & Sessions ===
export async function getChatRequests() {
  const res = await apiRequest("/api/v1/chat-requests");
  return res.data || res;
}
export async function sendChatRequest(toUserId) {
  const res = await apiRequest("/api/v1/chat-requests", { method: "POST", body: { toUserId } });
  return res.data || res;
}
export async function acceptChatRequest(requestId) {
  const res = await apiRequest(`/api/v1/chat-requests/${requestId}/accept`, { method: "POST" });
  return res.data || res;
}
export async function rejectChatRequest(requestId) {
  const res = await apiRequest(`/api/v1/chat-requests/${requestId}/reject`, { method: "POST" });
  return res.data || res;
}
export async function getChatMessages(sessionId) {
  const res = await apiRequest(`/api/v1/chat-sessions/${sessionId}/messages`);
  return res.data || [];
}
export async function sendChatMessage(sessionId, text, msgType = "text", attachments = []) {
  const res = await apiRequest(`/api/v1/chat-sessions/${sessionId}/messages`, { method: "POST", body: { text, msgType, attachments } });
  return res.data || res;
}
export async function clearChatMessages(sessionId) {
  const res = await apiRequest(`/api/v1/chat-sessions/${sessionId}/clear`, { method: "POST" });
  return res.data || res;
}
export async function disconnectChat(sessionId) {
  const res = await apiRequest(`/api/v1/chat-sessions/${sessionId}`, { method: "DELETE" });
  return res.data || res;
}

// === Channels ===
export async function getChannels() {
  const res = await apiRequest("/api/v1/channels");
  return res.data || [];
}
export async function createChannel(data) {
  const res = await apiRequest("/api/v1/channels", { method: "POST", body: data });
  return res.data || res;
}
export async function getChannelMessages(channelId) {
  const res = await apiRequest(`/api/v1/channels/${channelId}/messages`);
  return res.data || [];
}
export async function sendChannelMessage(channelId, text, msgType = "text", attachments = []) {
  const res = await apiRequest(`/api/v1/channels/${channelId}/messages`, { method: "POST", body: { text, msgType, attachments } });
  return res.data || res;
}

// === Collaboration Dashboard ===
export async function getCollaborationMetrics() {
  const res = await apiRequest("/api/v1/collaboration/metrics");
  return res.data || {};
}

// === Announcements ===
export async function getAnnouncements() {
  const res = await apiRequest("/api/v1/announcements");
  return res.data || [];
}
export async function createAnnouncement(data) {
  const res = await apiRequest("/api/v1/announcements", { method: "POST", body: data });
  return res.data || res;
}
export async function acknowledgeAnnouncement(id) {
  const res = await apiRequest(`/api/v1/announcements/${id}/acknowledge`, { method: "POST" });
  return res.data || res;
}

// === Approvals ===
export async function getChatApprovals() {
  const res = await apiRequest("/api/v1/chat/approvals");
  return res.data || [];
}
export async function processChatApproval(id, action, comment) {
  const res = await apiRequest(`/api/v1/chat/approvals/${id}/${action}`, { method: "POST", body: { comment } });
  return res.data || res;
}

// === Meetings ===
export async function getMeetings() {
  const res = await apiRequest("/api/v1/meetings");
  return res.data || [];
}
export async function createMeeting(data) {
  const res = await apiRequest("/api/v1/meetings", { method: "POST", body: data });
  return res.data || res;
}
export async function getMeetingRecording(meetingId) {
  const res = await apiRequest(`/api/v1/meetings/${meetingId}/recording`);
  return res.data || null;
}

// === AI Copilot ===
export async function sendAiChatMessage(message, history = []) {
  const res = await apiRequest("/api/v1/ai/chat", { method: "POST", body: { message, history } });
  return res.data || { content: "" };
}
export async function getAISummary(sessionId) {
  const res = await apiRequest(`/api/v1/ai/chat/${sessionId}/summary`);
  return res.data || "";
}
export async function generateActionItems(sessionId) {
  const res = await apiRequest(`/api/v1/ai/chat/${sessionId}/action-items`);
  return res.data || [];
}
export async function translateMessage(text, targetLang) {
  const res = await apiRequest("/api/v1/ai/translate", { method: "POST", body: { text, targetLang } });
  return res.data || text;
}
export async function suggestResponse(sessionId) {
  const res = await apiRequest(`/api/v1/ai/chat/${sessionId}/suggest`);
  return res.data || "";
}

// === Files ===
export async function uploadChatFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await apiRequest("/api/v1/chat/files/upload", { method: "POST", body: formData, headers: {} });
  return res.data || res;
}
export async function getChatFiles(channelId) {
  const res = await apiRequest(`/api/v1/chat/files/${channelId || ""}`);
  return res.data || [];
}

// === Search ===
export async function globalChatSearch(query, filters = {}) {
  const res = await apiRequest("/api/v1/chat/search", { method: "POST", body: { query, ...filters } });
  return res.data || [];
}

// === Presence ===
export async function updatePresence(status) {
  const res = await apiRequest("/api/v1/presence", { method: "PUT", body: { status } });
  return res.data || res;
}
export async function getPresences(userIds) {
  const res = await apiRequest("/api/v1/presence", { method: "POST", body: { userIds } });
  return res.data || {};
}
