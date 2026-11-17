import client from './client';

const BASE = '/api/v1/super-admin/website';

export const listDemoRequests = (params = {}) => client.get(`${BASE}/demo-requests`, { params });
export const updateDemoRequest = (id, data) => client.patch(`${BASE}/demo-requests/${id}`, data);
export const deleteDemoRequest = (id) => client.delete(`${BASE}/demo-requests/${id}`);

export const listContactMessages = (params = {}) => client.get(`${BASE}/contact-messages`, { params });
export const updateContactMessage = (id, data) => client.patch(`${BASE}/contact-messages/${id}`, data);
export const deleteContactMessage = (id) => client.delete(`${BASE}/contact-messages/${id}`);
