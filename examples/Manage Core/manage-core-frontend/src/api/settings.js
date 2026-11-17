import { apiRequest } from "./client";

export async function getStorageSettings() {
  const res = await apiRequest("/api/v1/settings/storage");
  return res.data;
}

export async function updateStorageSettings(storagePath) {
  const res = await apiRequest("/api/v1/settings/storage", {
    method: "PATCH",
    body: { storagePath },
  });

  return res.data;
}

export async function getStorageLimits() {
  const res = await apiRequest("/api/v1/storage-limits");
  return res.data;
}

export async function updateStorageLimit(userId, limitMb) {
  const res = await apiRequest(`/api/v1/storage-limits/${userId}`, {
    method: "PATCH",
    body: { storage_limit_mb: limitMb },
  });
  return res.data;
}

export async function getCompanyLimits() {
  const res = await apiRequest("/api/v1/company-limits/stats");
  return res.data || [];
}

export async function setCompanyLimit(organization, userLimit) {
  const res = await apiRequest("/api/v1/company-limits", {
    method: "POST",
    body: { organization, userLimit },
  });
  return res.data || res;
}

export async function updateCompanyLimit(id, userLimit) {
  const res = await apiRequest(`/api/v1/company-limits/${id}`, {
    method: "PATCH",
    body: { userLimit },
  });
  return res.data || res;
}
