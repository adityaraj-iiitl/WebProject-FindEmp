import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

if (import.meta.env.DEV) {
  console.log('[DEV] API_BASE_URL:', API_BASE_URL);
} else {
  console.log('[PROD] API_BASE_URL:', API_BASE_URL);
}

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'An error occurred';
        return Promise.reject(new Error(message));
    }
);

export default api;
