import axios from 'axios';
import { handleStaticRequest } from './staticBackend';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
export const STATIC_MODE = import.meta.env.VITE_STATIC_MODE === 'true';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

const liveAdapter = axios.getAdapter
  ? axios.getAdapter(api.defaults.adapter)
  : api.defaults.adapter;

api.defaults.adapter = async (config) => {
  if (STATIC_MODE) return handleStaticRequest(config);

  try {
    return await liveAdapter(config);
  } catch (error) {
    const isNetworkError = !error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED';
    if (isNetworkError) return handleStaticRequest(config);
    throw error;
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('crescent_admin_token') || sessionStorage.getItem('crescent_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'The request could not be completed.';
    error.userMessage = message;
    return Promise.reject(error);
  },
);

export default api;
