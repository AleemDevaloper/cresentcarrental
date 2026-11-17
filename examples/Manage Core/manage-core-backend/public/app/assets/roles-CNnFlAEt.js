import { Ol as apiRequest } from "./ai-BHgPkVLC.js";
//#region src/api/roles.js
async function listRoles() {
	const res = await apiRequest("/api/v1/roles", { validateAuthOnUnauthorized: true });
	return Array.isArray(res?.data) ? res.data : [];
}
async function createRole(role) {
	return (await apiRequest("/api/v1/roles", {
		method: "POST",
		body: role
	})).data;
}
async function updateRole(id, role) {
	return (await apiRequest(`/api/v1/roles/${id}`, {
		method: "PATCH",
		body: role
	})).data;
}
async function deleteRole(id) {
	await apiRequest(`/api/v1/roles/${id}`, { method: "DELETE" });
}
async function bulkUpdateUserRoles(userIds, role, role_id) {
	const body = {
		userIds,
		role
	};
	if (role_id !== void 0) body.role_id = role_id;
	await apiRequest("/api/v1/users/bulk-role-update", {
		method: "POST",
		body
	});
}
//#endregion
export { updateRole as a, listRoles as i, createRole as n, deleteRole as r, bulkUpdateUserRoles as t };
