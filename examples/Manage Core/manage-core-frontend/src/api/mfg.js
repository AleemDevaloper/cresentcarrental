import client from './client';

export const listProductionOrders = (params = {}) => client.get('/mfg/production-orders', { params });
export const getProductionOrder = (id) => client.get(`/mfg/production-orders/${id}`);
export const createProductionOrder = (data) => client.post('/mfg/production-orders', data);
export const updateProductionOrder = (id, data) => client.put(`/mfg/production-orders/${id}`, data);
export const deleteProductionOrder = (id) => client.delete(`/mfg/production-orders/${id}`);

export const listBoms = (params = {}) => client.get('/mfg/boms', { params });
export const getBom = (id) => client.get(`/mfg/boms/${id}`);
export const createBom = (data) => client.post('/mfg/boms', data);
export const updateBom = (id, data) => client.put(`/mfg/boms/${id}`, data);
export const deleteBom = (id) => client.delete(`/mfg/boms/${id}`);

export const listWorkOrders = (params = {}) => client.get('/mfg/work-orders', { params });
export const getWorkOrder = (id) => client.get(`/mfg/work-orders/${id}`);
export const createWorkOrder = (data) => client.post('/mfg/work-orders', data);
export const updateWorkOrder = (id, data) => client.put(`/mfg/work-orders/${id}`, data);
export const deleteWorkOrder = (id) => client.delete(`/mfg/work-orders/${id}`);

export const getMfgDashboard = () => client.get('/mfg/dashboard');
export const getMachineUtilization = () => client.get('/mfg/machine-utilization');
export const getMaterialConsumption = () => client.get('/mfg/material-consumption');
export const getProductionTimeline = () => client.get('/mfg/production-timeline');
export const getLowStockAlerts = () => client.get('/mfg/low-stock-alerts');
