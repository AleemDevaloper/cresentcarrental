import client from "./client";

export async function getGovernanceOverview() {
    const res = await client.get("/super-admin/governance/overview");
    return res.data;
}

export async function getGovernanceModules() {
    const res = await client.get("/super-admin/governance/modules");
    return res.data;
}

export async function updateModuleStatus(moduleId, status) {
    const res = await client.post(`/super-admin/governance/modules/${moduleId}/status`, { status });
    return res.data;
}

export async function cloneModule(moduleId) {
    const res = await client.post(`/super-admin/governance/modules/${moduleId}/clone`);
    return res.data;
}

export async function getGovernanceFeatures() {
    const res = await client.get("/super-admin/governance/features");
    return res.data;
}

export async function updateGovernanceFeature(featureId, data) {
    const res = await client.patch(`/super-admin/governance/features/${featureId}`, data);
    return res.data;
}

export async function getFeatureFlags() {
    const res = await client.get("/super-admin/governance/feature-flags");
    return res.data;
}

export async function createFeatureFlag(data) {
    const res = await client.post("/super-admin/governance/feature-flags", data);
    return res.data;
}

export async function updateFeatureFlag(id, data) {
    const res = await client.patch(`/super-admin/governance/feature-flags/${id}`, data);
    return res.data;
}

export async function getLicenses() {
    const res = await client.get("/super-admin/governance/licenses");
    return res.data;
}

export async function getGovernanceRoles() {
    const res = await client.get("/super-admin/governance/roles");
    return res.data;
}

export async function getGovernancePermissions() {
    const res = await client.get("/super-admin/governance/permissions");
    return res.data;
}

export async function getDataAccessRules() {
    const res = await client.get("/super-admin/governance/data-access");
    return res.data;
}

export async function getSecurityData() {
    const res = await client.get("/super-admin/governance/security");
    return res.data;
}

export async function getSessions() {
    const res = await client.get("/super-admin/governance/sessions");
    return res.data;
}

export async function terminateSession(id) {
    const res = await client.post(`/super-admin/governance/sessions/${id}/terminate`);
    return res.data;
}

export async function getApprovalWorkflows() {
    const res = await client.get("/super-admin/governance/approval-workflows");
    return res.data;
}

export async function getAuditLogs(params) {
    const res = await client.get("/super-admin/governance/audit-logs", { params });
    return res.data;
}

export async function getImpersonations() {
    const res = await client.get("/super-admin/governance/impersonations");
    return res.data;
}

export async function startImpersonation(data) {
    const res = await client.post("/super-admin/governance/impersonate", data);
    return res.data;
}

export async function getHealthData() {
    const res = await client.get("/super-admin/governance/health");
    return res.data;
}

export async function getAIGovernance() {
    const res = await client.get("/super-admin/governance/ai");
    return res.data;
}

export async function updateAISettings(id, data) {
    const res = await client.patch(`/super-admin/governance/ai/${id}`, data);
    return res.data;
}

export async function getCommandCenter() {
    const res = await client.get("/super-admin/governance/command-center");
    return res.data;
}

export async function getModules() {
    const res = await client.get("/super-admin/modules");
    return res.data;
}

export async function getModule(id) {
    const res = await client.get(`/super-admin/modules/${id}`);
    return res.data;
}

export async function createModule(data) {
    const res = await client.post("/super-admin/modules", data);
    return res.data;
}

export async function updateModule(id, data) {
    const res = await client.put(`/super-admin/modules/${id}`, data);
    return res.data;
}

export async function deleteModule(id) {
    const res = await client.delete(`/super-admin/modules/${id}`);
    return res.data;
}

export async function addFeature(moduleId, data) {
    const res = await client.post(`/super-admin/modules/${moduleId}/features`, data);
    return res.data;
}

export async function deleteFeature(featureId) {
    const res = await client.delete(`/super-admin/module-features/${featureId}`);
    return res.data;
}

export async function getModuleAssignments() {
    const res = await client.get("/super-admin/module-assignments");
    return res.data;
}

export async function assignModuleToTenant(data) {
    const res = await client.post("/super-admin/module-assignments", data);
    return res.data;
}

export async function removeModuleFromTenant(data) {
    const res = await client.delete("/super-admin/module-assignments", { data });
    return res.data;
}

export async function toggleTenantFeature(data) {
    const res = await client.post("/super-admin/module-assignments/toggle-feature", data);
    return res.data;
}

export async function getTenantModules(tenantId) {
    const res = await client.get(`/super-admin/tenants/${tenantId}/modules`);
    return res.data;
}

export async function getModuleStats() {
    const res = await client.get("/super-admin/modules/stats");
    return res.data;
}

export async function getModuleTrends() {
    const res = await client.get("/super-admin/modules/trends");
    return res.data;
}

export async function getPermissions() {
    const res = await client.get("/permissions");
    return res.data;
}

export async function getPermissionsFlat() {
    const res = await client.get("/permissions/list");
    return res.data;
}

export async function getRoles() {
    const res = await client.get("/roles");
    return res.data;
}

export async function getRole(id) {
    const res = await client.get(`/roles/${id}`);
    return res.data;
}

export async function createRole(data) {
    const res = await client.post("/roles", data);
    return res.data;
}

export async function updateRole(id, data) {
    const res = await client.patch(`/roles/${id}`, data);
    return res.data;
}

export async function deleteRole(id) {
    const res = await client.delete(`/roles/${id}`);
    return res.data;
}
