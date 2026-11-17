import { apiRequest } from './client';

export const listPermissions = async () => {
    try {
        const response = await apiRequest('/api/v1/permissions', { skipAuthRedirect: true });
        return response.data;
    } catch {
        return {};
    }
};

export const listPermissionsFlat = async () => {
    const response = await apiRequest('/api/v1/permissions/list');
    return response.data;
};
