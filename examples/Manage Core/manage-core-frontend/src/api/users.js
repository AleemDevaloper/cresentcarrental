import { apiRequest } from "./client";

export async function listUsers() {
  const res = await apiRequest("/api/v1/users", { validateAuthOnUnauthorized: true });
  return Array.isArray(res?.data) ? res.data : [];
}

export async function createUser(user) {
  const res = await apiRequest("/api/v1/users", {
    method: "POST",
    body: user,
  });
  return res.data;
}

export async function updateUser(id, user) {
  // If data is FormData, we MUST use POST with _method: PATCH for Laravel multipart updates
  if (user instanceof FormData) {
    user.append("_method", "PATCH");
    const res = await apiRequest(`/api/v1/users/${id}`, {
      method: "POST", // Browser/Laravel multipart limitation workaround
      body: user,
    });
    return res.data;
  }

  const res = await apiRequest(`/api/v1/users/${id}`, {
    method: "PATCH",
    body: user,
  });
  return res.data;
}

export async function deleteUser(id) {
  await apiRequest(`/api/v1/users/${id}`, { method: "DELETE" });
}

export async function updateUserPermissions(id, permissions) {
  const res = await apiRequest(`/api/v1/users/${id}/permissions`, {
    method: "PATCH",
    body: { permissions },
  });
  return res.data;
}
