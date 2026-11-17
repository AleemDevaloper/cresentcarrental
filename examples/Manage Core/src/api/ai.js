import axios from 'axios';

export async function listAiProviders() {
    const { data } = await axios.get('/api/ai/providers');
    return data.data;
}

export async function createAiProvider(payload) {
    const { data } = await axios.post('/api/ai/providers', payload);
    return data.data;
}

export async function updateAiProvider(id, payload) {
    const { data } = await axios.patch(`/api/ai/providers/${id}`, payload);
    return data.data;
}

export async function deleteAiProvider(id) {
    const { data } = await axios.delete(`/api/ai/providers/${id}`);
    return data;
}

export async function testAiProvider(id) {
    const { data } = await axios.post(`/api/ai/providers/${id}/test`);
    return data;
}

export async function getProviderModels() {
    const { data } = await axios.get('/api/ai/providers/models');
    return data.data;
}

export async function sendAiChat(payload) {
    const { data } = await axios.post('/api/ai/chat', payload);
    return data;
}

export async function getAiUsageStats(params = {}) {
    const { data } = await axios.get('/api/ai/usage', { params });
    return data;
}
