import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// API Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api' 
  : 'https://your-production-domain.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
export const tokenManager = {
  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('auth_token');
  },

  async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync('auth_token', token);
  },

  async removeToken(): Promise<void> {
    await SecureStore.deleteItemAsync('auth_token');
  },
};

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await tokenManager.removeToken();
      // Navigate to login screen
    }
    return Promise.reject(error);
  }
);

export { api };
export default api;