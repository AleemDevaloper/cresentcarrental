import { apiRequest } from "./client";

export async function listRoles() {
  const res = await apiRequest("/api/v1/roles", { validateAuthOnUnauthorized: true });
  return Array.isArray(res?.data) ? res.data : [];
}

export async function createRole(role) {
  const res = await apiRequest("/api/v1/roles", {
    method: "POST",
    body: role,
  });
  return res.data;
}

export async function updateRole(id, role) {
  const res = await apiRequest(`/api/v1/roles/${id}`, {
    method: "PATCH",
    body: role,
  });
  return res.data;
}

export async function deleteRole(id) {
  await apiRequest(`/api/v1/roles/${id}`, { method: "DELETE" });
}

export async function bulkUpdateUserRoles(userIds, role, role_id) {
  const body = { userIds, role };
  if (role_id !== undefined) body.role_id = role_id;

  await apiRequest("/api/v1/users/bulk-role-update", {
    method: "POST",
    body,
  });
}
