import axiosInstance from "./axiosInstance";

export const getOffers = async () => {
    try {
        const response = await axiosInstance.get('/offers');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const createOffer = async (offerData) => {
    try {
        const response = await api.post('/offers', offerData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const updateOffer = async (id, offerData) => {
    try {
        const response = await axiosInstance.put(`/offers/${id}`, offerData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const deleteOffer = async (id) => {
    try {
        const response = await axiosInstance.delete(`/offers/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getOfferById = async (id) => {
    try {
        const response = await axiosInstance.get(`/offers/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}