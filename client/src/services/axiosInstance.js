import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status } = error.response;
            switch (status) {
                case 401:
                    console.error('Unauthorized, redirecting to login.');
                    localStorage.removeItem('token');
                    window.location.href = '/auth/login';
                    break;
                case 429:
                    alert('Too many requests. Please try again later.');
                    break;
                default:
                    console.error(`Error ${status}:`, error.response.data.message || error.message);
                    break;
            }
        } else {
            console.error('Network error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
