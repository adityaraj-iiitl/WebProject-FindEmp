import axios from 'axios';

// Use relative path for proxying in dev, or environment variable for production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'; 

const api = axios.create({
    baseURL: API_BASE_URL
});

export default api;
