import axiosInstance from "./axiosInstance";
// add Auth header


// Get all users
const getUsers = async () => {
    try {
        const response = await axiosInstance.get("/users");
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Delete a user
const deleteUser = async (id) => {
    try {
        const response = await axiosInstance.delete(`/users/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Update a user
const updateUser = async (id, userData) => {
    try {
        const response = await axiosInstance.put(`/users/${id}`, userData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Get a user by ID
const getUserById = async (id) => {
    try {
        const response = await axiosInstance.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Create a new user
const createUser = async (userData) => {
    try {
        const response = await axiosInstance.post("/users", userData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Named Exports
export {
    getUsers,
    deleteUser,
    updateUser,
    getUserById,
    createUser,
};
