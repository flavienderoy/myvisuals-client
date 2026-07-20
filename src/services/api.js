import axios from 'axios';
import { supabase } from '../supabaseClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL
});

// Request interceptor to automatically add the Supabase JWT token
api.interceptors.request.use(
    async (config) => {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Optional: Response interceptor for handling common errors (like 401) and retrying 429s
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;
        if (error.response?.status === 429 && config && !config.__retryCount) {
            config.__retryCount = 0;
        }
        if (error.response?.status === 429 && config && config.__retryCount < 3) {
            config.__retryCount += 1;
            const delay = Math.pow(2, config.__retryCount - 1) * 1000; // 1s, 2s, 4s
            await new Promise((r) => setTimeout(r, delay));
            return api(config);
        }
        if (error.response?.status === 401) {
            console.warn('Unauthorized request. Token might be expired.');
        }
        return Promise.reject(error);
    }
);

export default api;
