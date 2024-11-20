import axiosInstance from './axiosInstance';

const galleryService = {
    async getGallery() {
        try {
            const response = await axiosInstance.get('/gallery');
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.error);
        }
    },
    async getGalleryItem(id) {
        try {
            const response = await axiosInstance.get(`/gallery/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.error);
        }
    },
    async createGalleryItem(data) {
        try {
            const response = await axiosInstance.post('/gallery', data);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.error);
        }
    },
    async updateGalleryItem(id, data) {
        try {
            const response = await axiosInstance.put(`/gallery/${id}`, data);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.error);
        }
    },
    async deleteGalleryItem(id) {
        try {
            await axiosInstance.delete(`/gallery/${id}`);
        } catch (error) {
            throw new Error(error.response.data.error);
        }
    },
    async likeGalleryItem(id) {
        try {
            const response = await axiosInstance.put(`/gallery/${id}/like`);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.error);
        }
    },
    async LoveGalleryItem(id) {
        try {
            const response = await axiosInstance.put(`/gallery/${id}/love`);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.error);
        }
    },
};

export default galleryService;