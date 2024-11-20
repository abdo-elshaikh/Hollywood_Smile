import axiosInstance from "./axiosInstance";

const fetchServices = async () => {
    try {
        const response = await axiosInstance.get('/services');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

const createService = async (serviceData) => {
    try {
        const response = await axiosInstance.post('/services', serviceData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

const updateService = async (id, serviceData) => {
    try {
        const response = await axiosInstance.put(`/services/${id}`, serviceData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

const deleteService = async (id) => {
    try {
        const response = await axiosInstance.delete(`/services/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export { fetchServices, createService, updateService, deleteService };