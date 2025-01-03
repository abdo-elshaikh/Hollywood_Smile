import axios from 'axios';

// Get the base URL from environment variables
const baseUrl = import.meta.env.VITE_API_URL;

// Create an Axios instance with default configurations
const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
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
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle responses or errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        // Process and return successful responses
        return response;
    },
    (error) => {
        if (error.response) {
            const { status } = error.response;
            if (status === 401) {
                console.error('Unauthorized access, redirecting to login.');
                localStorage.removeItem('token');
                window.location.href = '/auth/login';
            } else if (status === 429) {
                console.error('Too many requests, please try again later.');
            } else {
                console.error(`Error ${status}:`, error.response.data.message || error.message);
            }
        } else {
            // Handle network errors or other unexpected issues
            console.error('Network error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
