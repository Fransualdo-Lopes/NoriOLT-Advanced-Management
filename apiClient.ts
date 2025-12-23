
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { CONFIG } from './config';

const apiClient: AxiosInstance = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('nori_auth_token');
    const lang = localStorage.getItem('nori_language') || 'en';
    
    if (config.headers) {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      // Inform the backend which language the user expects for error messages
      config.headers['Accept-Language'] = lang;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nori_auth_token');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
