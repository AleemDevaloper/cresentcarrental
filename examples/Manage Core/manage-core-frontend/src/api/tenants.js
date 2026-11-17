import client from "./client";

export async function listTenants() {
  const res = await client.get("/tenants");
  return res.data;
}

export async function provisionTenant(data) {
  const res = await client.post("/tenants/provision", data);
  return res.data.data;
}

export async function updateTenant(id, data) {
  const res = await client.put(`/tenants/${id}`, data);
  return res.data;
}

export async function deleteTenant(id) {
  const res = await client.delete(`/tenants/${id}`);
  return res.data;
}

export async function syncTenantSystems(id, modules) {
  const res = await client.put(`/tenants/${id}/systems`, { modules });
  return res.data.data;
}

export async function listTenantUsers(id) {
  const res = await client.get(`/tenants/${id}/users`);
  return res.data.data;
}

export async function getTenantUser(tenantId, userId) {
  const res = await client.get(`/tenants/${tenantId}/users/${userId}`);
  return res.data.data;
}

export async function createTenantUser(tenantId, data) {
  const res = await client.post(`/tenants/${tenantId}/users`, data);
  return res.data.data;
}

export async function updateTenantUser(tenantId, userId, data) {
  const res = await client.put(`/tenants/${tenantId}/users/${userId}`, data);
  return res.data;
}

export async function deleteTenantUser(tenantId, userId) {
  const res = await client.delete(`/tenants/${tenantId}/users/${userId}`);
  return res.data;
}

export async function resetTenantUserPassword(tenantId, userId, password) {
  const res = await client.post(`/tenants/${tenantId}/users/${userId}/reset-password`, { password });
  return res.data;
}

export async function syncTenantUserSystems(tenantId, userId, modules) {
  const res = await client.put(`/tenants/${tenantId}/users/${userId}/systems`, { modules });
  return res.data;
}
