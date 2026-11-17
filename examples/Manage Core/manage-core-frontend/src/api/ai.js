import client from './client';

// --- AI Providers ---

export async function listAiProviders() {
    const { data } = await client.get('/ai/providers');
    return data.data;
}

export async function createAiProvider(payload) {
    const { data } = await client.post('/ai/providers', payload);
    return data.data;
}

export async function updateAiProvider(id, payload) {
    const { data } = await client.patch(`/ai/providers/${id}`, payload);
    return data.data;
}

export async function deleteAiProvider(id) {
    const { data } = await client.delete(`/ai/providers/${id}`);
    return data;
}

export async function testAiProvider(id) {
    const { data } = await client.post(`/ai/providers/${id}/test`);
    return data;
}

export async function getProviderModels() {
    const { data } = await client.get('/ai/providers/models');
    return data.data;
}

export async function sendAiChat(payload) {
    const { data } = await client.post('/ai/chat', payload);
    return data;
}

export async function detectProviderModels(payload) {
    const { data } = await client.post('/ai/providers/detect', payload);
    return data.data;
}

// --- AI Usage ---

export async function getAiUsageStats(params = {}) {
    const { data } = await client.get('/ai/usage', { params });
    return data;
}

// --- AI Quotas ---

export async function getAiQuotas() {
    const { data } = await client.get('/ai/quotas');
    return data.data;
}

export async function setAiQuota(payload) {
    const { data } = await client.post('/ai/quotas', payload);
    return data;
}

export async function updateAiQuota(id, payload) {
    const { data } = await client.patch(`/ai/quotas/${id}`, payload);
    return data;
}

// --- AI Training Center ---

export async function getAiTrainingDashboard() {
    const { data } = await client.get('/ai/training/dashboard');
    return data.data;
}

export async function listAiTrainingModels() {
    const { data } = await client.get('/ai/training/models');
    return data.data;
}

export async function createAiTrainingModel(payload) {
    const { data } = await client.post('/ai/training/models', payload);
    return data.data;
}

export async function updateAiTrainingModel(id, payload) {
    const { data } = await client.patch(`/ai/training/models/${id}`, payload);
    return data.data;
}

export async function deleteAiTrainingModel(id) {
    const { data } = await client.delete(`/ai/training/models/${id}`);
    return data;
}

export async function listAiTrainingDatasets(modelId) {
    const { data } = await client.get(`/ai/training/models/${modelId}/datasets`);
    return data.data;
}

export async function uploadAiTrainingDataset(modelId, payload) {
    const { data } = await client.post(`/ai/training/models/${modelId}/datasets`, payload);
    return data.data;
}

export async function deleteAiTrainingDataset(modelId, datasetId) {
    const { data } = await client.delete(`/ai/training/models/${modelId}/datasets/${datasetId}`);
    return data;
}

export async function startAiTraining(modelId) {
    const { data } = await client.post(`/ai/training/models/${modelId}/start`);
    return data.data;
}

export async function getAiTrainingStatus(modelId) {
    const { data } = await client.get(`/ai/training/models/${modelId}/status`);
    return data.data;
}

export async function stopAiTraining(modelId) {
    const { data } = await client.post(`/ai/training/models/${modelId}/stop`);
    return data;
}

export async function listAiTrainingSessions(modelId) {
    const { data } = await client.get(`/ai/training/models/${modelId}/sessions`);
    return data.data;
}

export async function listAllAiTrainingSessions() {
    const { data } = await client.get('/ai/training/models');
    // Get all sessions from all models
    const models = data.data || [];
    const allSessions = [];
    for (const model of models) {
        try {
            const { data: sessData } = await client.get(`/ai/training/models/${model.id}/sessions`);
            if (sessData.data) allSessions.push(...sessData.data);
        } catch { /* skip */ }
    }
    return allSessions;
}

export async function listAiTrainingAgents() {
    const { data } = await client.get('/ai/training/agents');
    return data.data;
}

export async function createAiTrainingAgent(payload) {
    const { data } = await client.post('/ai/training/agents', payload);
    return data.data;
}

export async function updateAiTrainingAgent(id, payload) {
    const { data } = await client.patch(`/ai/training/agents/${id}`, payload);
    return data.data;
}

export async function deleteAiTrainingAgent(id) {
    const { data } = await client.delete(`/ai/training/agents/${id}`);
    return data;
}
