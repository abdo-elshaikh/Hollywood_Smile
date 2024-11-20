import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL;
// Create an axios instance with default configurations
const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the authorization token from local storage
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle responses or errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized access, please login again.');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
