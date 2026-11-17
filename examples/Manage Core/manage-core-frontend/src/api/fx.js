import client from './client';

export const getFxDashboard = () => client.get('/fx/dashboard');

export const listCurrencies = (params = {}) => client.get('/fx/currencies', { params });
export const getCurrency = (id) => client.get(`/fx/currencies/${id}`);
export const createCurrency = (data) => client.post('/fx/currencies', data);
export const updateCurrency = (id, data) => client.put(`/fx/currencies/${id}`, data);
export const deleteCurrency = (id) => client.delete(`/fx/currencies/${id}`);

export const listExchangeRates = (params = {}) => client.get('/fx/exchange-rates', { params });
export const getExchangeRate = (id) => client.get(`/fx/exchange-rates/${id}`);
export const createExchangeRate = (data) => client.post('/fx/exchange-rates', data);
export const updateExchangeRate = (id, data) => client.put(`/fx/exchange-rates/${id}`, data);
export const deleteExchangeRate = (id) => client.delete(`/fx/exchange-rates/${id}`);
export const syncExchangeRates = () => client.post('/fx/exchange-rates/sync');

export const listFxTransactions = (params = {}) => client.get('/fx/transactions', { params });
export const getFxTransaction = (id) => client.get(`/fx/transactions/${id}`);
export const createFxTransaction = (data) => client.post('/fx/transactions', data);
export const updateFxTransaction = (id, data) => client.put(`/fx/transactions/${id}`, data);
export const deleteFxTransaction = (id) => client.delete(`/fx/transactions/${id}`);

export const listRevaluations = (params = {}) => client.get('/fx/revaluations', { params });
export const getRevaluation = (id) => client.get(`/fx/revaluations/${id}`);
export const createRevaluation = (data) => client.post('/fx/revaluations', data);
export const approveRevaluation = (id, data) => client.put(`/fx/revaluations/${id}/approve`, data);
export const deleteRevaluation = (id) => client.delete(`/fx/revaluations/${id}`);

export const getExposureAnalytics = () => client.get('/fx/exposure');
export const getGainLossSummary = () => client.get('/fx/gain-loss');
export const getTreasurySummary = () => client.get('/fx/treasury');
