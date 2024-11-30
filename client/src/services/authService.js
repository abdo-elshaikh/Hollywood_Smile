import axiosInstance from './axiosInstance';


const loginUser = async (userData) => {
    try {
        const response = await axiosInstance.post('/auth/login', userData);
        if (response.status === 200 && response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

const registerUser = async (userData) => {
    try {
        const response = await axiosInstance.post('/auth/register', userData);
        if (response.status === 201 && response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

const getUserProfile = async () => {
    try {
        const response = await axiosInstance.get('/auth/profile');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

const updateUserProfile = async (userData) => {
    try {
        const response = await axiosInstance.put('/auth/profile', userData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

const changePassword = async (currentPassword, newPassword) => {
    try {
        const response = await axiosInstance.put('/auth/change-password', { currentPassword, newPassword });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export { registerUser, loginUser, logoutUser, getUserProfile, updateUserProfile, changePassword };
