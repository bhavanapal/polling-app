import axios from 'axios';
import { getToken } from '../../modules/auth/store/authStore';

// Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    // baseURL: "http://localhost:8000/api/v1",
    withCredentials: true,
});

// Add interceptors for auth token from zustand
api.interceptors.request.use((config) => {
    const token = getToken();
    if(token && config.headers){
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default api;