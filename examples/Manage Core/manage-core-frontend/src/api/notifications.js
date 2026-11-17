import { apiRequest } from "./client";

export async function listNotifications(role, options = {}) {
  const safeRole = encodeURIComponent(role || "");
  const path = safeRole ? `/api/v1/notifications/${safeRole}` : "/api/v1/notifications";
  return apiRequest(path, { skipAuthRedirect: true, ...options });
}

export async function markAsRead(id) {
  return apiRequest(`/api/v1/notifications/${id}/read`, { method: "POST" });
}

export async function markAllAsRead() {
  return apiRequest("/api/v1/notifications/read-all", { method: "POST" });
}
